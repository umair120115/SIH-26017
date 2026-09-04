import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DoLR LARR Act 2013 Predictive Analytics API"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api/v1"
    PORT: int = 8000
    
    # Database Configuration (PostgreSQL / Supabase connection)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    
    # Embedding Model Name
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # Optional Shared Google Doc ID for real-time status updates
    GOOGLE_DOC_ID: Optional[str] = os.getenv("GOOGLE_DOC_ID", None)
    GOOGLE_CREDS_PATH: str = os.getenv("GOOGLE_CREDS_PATH", "credentials.json")
    
    # Pluggable Custom Model Weight Path
    CUSTOM_MODEL_PATH: Optional[str] = os.getenv("CUSTOM_MODEL_PATH", "models/model.json")
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        extra = "ignore"

settings = Settings()
