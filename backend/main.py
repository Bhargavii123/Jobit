from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.resume import router as resume_router
from routes.jobs import router as jobs_router
import os

load_dotenv()

app = FastAPI(title="Jobit API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(jobs_router)

@app.get("/")
def root():
    return {"message": "Jobit API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}
