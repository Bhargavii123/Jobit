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
    prompt = f"""
    Analyze this resume and extract the following information in JSON format only:
    {{
        "name": "candidate name",
        "email": "email address",
        "skills": ["skill1", "skill2", ...],
        "experience_years": number,
        "education": "highest degree",
        "job_titles": ["previous job title 1", ...],
        "summary": "2 line professional summary"
    }}
    
    Resume:
    {resume_text[:3000]}
    
    Return ONLY valid JSON, no extra text.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    
    result = response.choices[0].message.content.strip()
    # Remove markdown code blocks if AI wrapped response in them
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    result = result.strip()
    return json.loads(result)