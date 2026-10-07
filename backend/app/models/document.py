from sqlalchemy import Column, String, Date, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    
    # Indexed for fast filtering on the dashboard
    category = Column(String, index=True)
    
    issue_date = Column(Date, nullable=True)
    # Indexed heavily for the Expiration Engine
    expiration_date = Column(Date, index=True, nullable=True)
    
    # Store dynamic metadata based on category
    extracted_data = Column(JSON, nullable=True)
    
    is_archived = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
