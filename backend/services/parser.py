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
    prompt = f"""Analyze this resume and extract info in JSON format only. Return ONLY valid JSON, no markdown, no extra text.
Format: {{"name": "string", "email": "string", "skills": ["skill1", "skill2"], "experience_years": 0, "education": "string", "job_titles": ["title1"], "summary": "string"}}
Resume: {resume_text[:3000]}"""
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
    prompt = f"""Based on these skills and job titles, suggest job search terms. Return ONLY valid JSON, no markdown.
Format: {{"primary_role": "string", "all_roles": ["role1", "role2"], "search_keywords": ["kw1", "kw2", "kw3"], "remotive_category": "software-development"}}
Skills: {skills}
Job titles: {job_titles}
Rules: List ALL applicable roles. Include fresher-friendly roles. Be specific e.g. AI Engineer not just Engineer."""
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


def calculate_match_score(resume_skills: list, job_description: str, job_title: str) -> dict:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""Analyze how well this candidate matches this job. Return ONLY valid JSON, no markdown.
Format: {{"match_score": 75, "matched_skills": ["skill1", "skill2"], "missing_skills": ["skill3"], "verdict": "Good Match"}}
Rules:
- match_score is 0-100 integer
- matched_skills are skills from resume that appear in job description
- missing_skills are skills job needs that candidate lacks
- verdict is one of: Strong Match, Good Match, Partial Match, Weak Match
Resume Skills: {resume_skills}
Job Title: {job_title}
Job Description: {job_description[:1000]}"""
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
def generate_cover_letter(profile: dict, job_title: str, company: str, job_description: str) -> str:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""Write a professional cover letter for this candidate applying to this job. Return ONLY the cover letter text, no extra commentary.
Candidate: {profile.get('name')}
Summary: {profile.get('summary')}
Skills: {profile.get('skills')}
Experience: {profile.get('experience_years')} years
Education: {profile.get('education')}
Job Title: {job_title}
Company: {company}
Job Description: {job_description[:500]}
Write a concise 3-paragraph cover letter. Professional tone. First paragraph: why this role. Second paragraph: relevant skills and experience. Third paragraph: closing."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600
    )
    return response.choices[0].message.content.strip()