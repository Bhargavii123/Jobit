import httpx
import os
from dotenv import load_dotenv
from services.parser import generate_search_terms

load_dotenv()


async def fetch_jooble_jobs(skills: list, location: str = "India", job_titles: list = []) -> list:
    api_key = os.getenv("JOOBLE_API_KEY")
    search_info = generate_search_terms(skills, job_titles)
    primary_role = search_info["primary_role"]
    skill_keywords = " ".join(skills[:3])
    keywords = f"{primary_role} {skill_keywords} fresher OR junior OR entry level"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://jooble.org/api/{api_key}",
            json={"keywords": keywords, "location": location, "page": 1},
            timeout=10
        )
        data = response.json()
        jobs = data.get("jobs", [])
        return [{"title": j.get("title", ""), "company": j.get("company", ""), "location": j.get("location", ""), "description": j.get("snippet", "")[:300], "url": j.get("link", ""), "salary": j.get("salary", "Not specified"), "source": "Jooble"} for j in jobs[:15]]


async def fetch_remotive_jobs(skills: list, job_titles: list = []) -> list:
    search_info = generate_search_terms(skills, job_titles)
    keywords = " ".join(search_info["search_keywords"][:3])
    category = search_info["remotive_category"]
    primary_role = search_info["primary_role"]
    all_roles = search_info.get("all_roles", [primary_role])

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://remotive.com/api/remote-jobs",
            params={"search": keywords, "category": category, "limit": 30},
            timeout=10
        )
        data = response.json()
        jobs = data.get("jobs", [])
        relevant_keywords = [w.lower() for w in search_info["search_keywords"]] + [r.lower() for r in all_roles]
        filtered = [j for j in jobs if any(kw in j.get("title", "").lower() for kw in relevant_keywords)]
        final_jobs = filtered if len(filtered) >= 3 else jobs[:15]
        return [{"title": j.get("title", ""), "company": j.get("company_name", ""), "location": "Remote", "description": j.get("description", "")[:300], "url": j.get("url", ""), "salary": j.get("salary", "Not specified"), "source": "Remotive"} for j in final_jobs[:15]]


async def fetch_all_jobs(skills: list, location: str = "India", job_titles: list = []) -> list:
    jooble_jobs = []
    remotive_jobs = []

    try:
        jooble_jobs = await fetch_jooble_jobs(skills, location=location, job_titles=job_titles)
    except Exception as e:
        print(f"Jooble error: {e}")

    try:
        remotive_jobs = await fetch_remotive_jobs(skills, job_titles=job_titles)
    except Exception as e:
        print(f"Remotive error: {e}")

    all_jobs = jooble_jobs + remotive_jobs
    seen_urls = set()
    unique_jobs = []
    for job in all_jobs:
        if job["url"] not in seen_urls:
            seen_urls.add(job["url"])
            unique_jobs.append(job)
    return unique_jobs