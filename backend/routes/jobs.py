from fastapi import APIRouter, HTTPException
from services.job_fetcher import fetch_all_jobs
from pydantic import BaseModel

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobSearchRequest(BaseModel):
    skills: list[str]
    location: str = "India"
    cities: list[str] = []
    job_titles: list[str] = []

@router.post("/search")
async def search_jobs(request: JobSearchRequest):
    if not request.skills:
        raise HTTPException(status_code=400, detail="Skills list cannot be empty")

    if request.cities:
        all_jobs = []
        seen_urls = set()
        for city in request.cities[:3]:
            jobs = await fetch_all_jobs(request.skills, location=city, job_titles=request.job_titles)
            for job in jobs:
                if job["url"] not in seen_urls:
                    seen_urls.add(job["url"])
                    all_jobs.append(job)
    else:
        all_jobs = await fetch_all_jobs(request.skills, location=request.location, job_titles=request.job_titles)

    return {
        "success": True,
        "total": len(all_jobs),
        "jobs": all_jobs
    }