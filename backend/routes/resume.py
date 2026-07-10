from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.parser import extract_text_from_pdf, extract_skills_with_ai, calculate_match_score, generate_cover_letter

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
    return {"success": True, "profile": profile}


class ScoreRequest(BaseModel):
    resume_skills: list[str]
    job_description: str
    job_title: str


@router.post("/score")
async def score_job(request: ScoreRequest):
    result = calculate_match_score(request.resume_skills, request.job_description, request.job_title)
    return {"success": True, "result": result}
class CoverLetterRequest(BaseModel):
    profile: dict
    job_title: str
    company: str
    job_description: str


@router.post("/coverletter")
async def cover_letter(request: CoverLetterRequest):
    letter = generate_cover_letter(
        request.profile,
        request.job_title,
        request.company,
        request.job_description
    )
    return {"success": True, "cover_letter": letter}