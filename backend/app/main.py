from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
import os

# Create the uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Import models so SQLAlchemy registers them before creating tables
from app.models.document import Document

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Filing Assistant API",
    description="Backend API for managing and analyzing documents.",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Digital Filing Assistant API"}

from app.api import documents
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
