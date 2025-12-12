from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pdfplumber
import re
import os
from data import *

app = FastAPI()

# ------------------ CORS FIX ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # or ["http://localhost:5173"]
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ------------------ PDF → TEXT ------------------
def extract_text_from_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

# ------------------ EMAIL ------------------
def extract_email(text):
    pat = r'\b[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
    m = re.search(pat, text)
    return m.group(0) if m else None

# ------------------ PHONE ------------------
def extract_phone(text):
    pat = r'\b(?:\d[\s-]*){10}\b'
    m = re.search(pat, text)
    if m:
        num = re.sub(r'[\s-]', '', m.group(0))
        if len(num) == 10:
            return num
    return None

# ------------------ NAME ------------------
def extract_name(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if len(lines) == 0:
        return None
    first = lines[0]
    if len(first.split()) <= 4 and not any(ch.isdigit() for ch in first):
        return first
    return None

# ------------------ SKILLS ------------------
def extract_skills(text):
    text = text.lower()
    found = []
    for skill in skills_list:
        if skill in text:
            found.append(skill.capitalize())
    return found

# ------------------ EDUCATION ------------------
degree_pattern = r"^(b\.?e\.?|b\.?tech|m\.?e\.?|m\.?tech|bsc|msc|diploma|h\.?s\.?c|sslc|10th|10 th|x|matric)"
exclude_words = ["developer", "skills", "projects", "experience", "summary", "tools", "languages"]

def extract_marks(line):
    pat = r'(\d{1,2}\.?\d{0,2}%?)|(cgpa[: ]?\d\.?\d?)'
    m = re.search(pat, line.lower())
    if not m:
        return None
    val = m.group(0).upper()
    if re.fullmatch(r"\d{4}", val):
        return None
    return val

def extract_year(line):
    m = re.search(r"\b(20[0-4][0-9])\b", line)
    return m.group(1) if m else None

def extract_education(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    edu = []

    for i, line in enumerate(lines):
        low = line.lower()

        if not re.match(degree_pattern, low):
            continue
        if any(w in low for w in exclude_words):
            continue

        if "," in line:
            parts = [p.strip() for p in line.split(",")]
            degree = parts[0]
            institute = ", ".join(parts[1:])
        else:
            degree = line
            institute = None

        if institute is None and i+1 < len(lines):
            nxt = lines[i+1]
            if not re.match(degree_pattern, nxt.lower()):
                institute = nxt

        marks = extract_marks(line)
        if not marks and i+1 < len(lines):
            marks = extract_marks(lines[i+1])

        year = extract_year(line)
        if not year and i+1 < len(lines):
            year = extract_year(lines[i+1])

        edu.append({
            "degree": degree,
            "institute": institute,
            "marks": marks,
            "passout_year": year
        })

    return edu

# ------------------ API ENDPOINT ------------------
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    temp_file = "temp.pdf"

    with open(temp_file, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(temp_file)

    response = {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": extract_education(text)
    }

    if os.path.exists(temp_file):
        os.remove(temp_file)

    return JSONResponse(content=response)
