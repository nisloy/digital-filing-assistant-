from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from pathlib import Path

from app.core.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[DocumentResponse])
async def get_all_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return docs

UPLOAD_DIR = Path("uploads")
# Ensure the directory exists (though main.py does it too)
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...), 
    skip_ai: bool = False,
    db: Session = Depends(get_db)
):
    # 1. Generate unique filename to avoid collisions
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1]
    new_filename = f"{file_id}{extension}"
    file_path = UPLOAD_DIR / new_filename
    
    # 2. Save the original file to disk safely
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file to disk: {e}")
    
    # 3. Process with AI ("The Brain")
    metadata = None
    if not skip_ai:
        from app.services.ai_service import extract_document_metadata
        metadata = extract_document_metadata(str(file_path))
        
        # If AI extraction failed, don't store it yet. Tell the frontend to ask the user.
        if metadata and "ai_extraction_error" in metadata.get("extracted_data", {}):
            # Delete the orphaned file since we aren't saving it to the DB yet
            os.remove(file_path)
            error_msg = metadata["extracted_data"]["ai_extraction_error"]
            raise HTTPException(
                status_code=400, 
                detail={"code": "AI_EXTRACTION_FAILED", "message": error_msg}
            )
    
    # 4. Create database record
    from datetime import datetime
    new_doc = Document(
        id=file_id,
        filename=file.filename,
        filepath=str(file_path),
        file_type=file.content_type,
        category="Uncategorized"
    )
    
    if metadata and not skip_ai:
        new_doc.category = metadata.get("category", "Uncategorized")
        
        # Parse dates safely
        issue_date_str = metadata.get("issue_date")
        if issue_date_str:
            try:
                new_doc.issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
                
        expiration_date_str = metadata.get("expiration_date")
        if expiration_date_str:
            try:
                new_doc.expiration_date = datetime.strptime(expiration_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
                
        new_doc.extracted_data = metadata.get("extracted_data", {})
    elif skip_ai:
        new_doc.extracted_data = {"note": "Stored without AI metadata"}

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return new_doc

@router.get("/{document_id}/file")
async def get_document_file(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document metadata not found")
    
    if not os.path.exists(doc.filepath):
        raise HTTPException(status_code=404, detail="Actual file not found on disk")
        
    # Return the file directly for browser preview (PDF/Image)
    return FileResponse(
        doc.filepath, 
        media_type=doc.file_type, 
        content_disposition_type="inline"
    )
