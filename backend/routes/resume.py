from fastapi import APIRouter, UploadFile, File, HTTPException
from services.parser import extract_text_from_pdf, extract_skills_with_ai
import json

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files accepted")
    
    file_bytes = await file.read()
    
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB")
    
    text = extract_text_from_pdf(file_bytes)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    
    profile = extract_skills_with_ai(text)
    
    return {
        "success": True,
        "profile": profile
    }
