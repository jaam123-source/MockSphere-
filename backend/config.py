import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "ai-multimodal-interview-secret-key-2026")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///../database/interview.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    
    # Progression Cutoffs
    DEFAULT_LEVEL_CUTOFF = int(os.getenv("DEFAULT_LEVEL_CUTOFF", 70))
    DEFAULT_TEST_CUTOFF = int(os.getenv("DEFAULT_TEST_CUTOFF", 70))
    DEFAULT_FINAL_TEST_CUTOFF = int(os.getenv("DEFAULT_FINAL_TEST_CUTOFF", 70))
    DEFAULT_TECH_CUTOFF = int(os.getenv("DEFAULT_TECH_CUTOFF", 60))
    DEFAULT_HR_CUTOFF = int(os.getenv("DEFAULT_HR_CUTOFF", 60))
    
    # Timers (Minutes)
    LEVEL_TIMER_MINUTES = int(os.getenv("LEVEL_TIMER_MINUTES", 10))
    TEST_TIMER_MINUTES = int(os.getenv("TEST_TIMER_MINUTES", 20))
    FINAL_TEST_TIMER_MINUTES = int(os.getenv("FINAL_TEST_TIMER_MINUTES", 30))
