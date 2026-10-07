from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import date, datetime

# Schema for the AI response
class AIExtractionSchema(BaseModel):
    category: str = Field(description="The category of the document")
    issue_date: Optional[date] = Field(None, description="The issue date of the document")
    expiration_date: Optional[date] = Field(None, description="The expiration date of the document")
    extracted_data: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional dynamic extracted details")

# Schema for returning a document to the client
class DocumentResponse(BaseModel):
    id: str
    filename: str
    filepath: str
    file_type: str
    category: Optional[str]
    issue_date: Optional[date]
    expiration_date: Optional[date]
    extracted_data: Optional[Dict[str, Any]]
    is_archived: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schema for updating a document manually (Overrides)
class DocumentUpdate(BaseModel):
    category: Optional[str] = None
    issue_date: Optional[date] = None
    expiration_date: Optional[date] = None
    extracted_data: Optional[Dict[str, Any]] = None
    is_archived: Optional[bool] = None
