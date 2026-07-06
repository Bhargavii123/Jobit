import fitz
import os
from dotenv import load_dotenv
from groq import Groq
import json

load_dotenv()


def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def extract_skills_with_ai(resume_text: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""Analyze this resume and extract the following in JSON format only:
    {{"name": "candidate name", "email": "email", "skills": ["skill1"], "experience_years": 0, "education": "degree", "job_titles": ["title"], "summary": "summary"}}
    Resume: {resume_text[:3000]}
    Return ONLY valid JSON, no markdown."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    result = response.choices[0].message.content.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())


def generate_search_terms(skills: list, job_titles: list) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""Based on these skills and job titles, suggest job search terms.
    Skills: {skills}
    Job titles: {job_titles}
    Return ONLY valid JSON:
    {{"primary_role": "AI Engineer", "all_roles": ["role1", "role2"], "search_keywords": ["kw1", "kw2", "kw3"], "remotive_category": "software-development"}}
    Rules: List ALL roles. Include fresher roles like Junior Developer. Be specific."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    result = response.choices[0].message.content.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())