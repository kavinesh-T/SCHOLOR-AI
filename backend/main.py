"""
ScholarMatch AI - FastAPI REST Backend
Production-ready REST API for Scholarship Search, AI Eligibility Checker,
Random Forest Predictions, Recommendations, and Admin Data Management.
"""

from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import csv
import io
import json

from models import StudentProfile, ScholarshipFilter, ScholarshipRecord, ComparisonRequest, AdminLoginRequest
from database import (
    init_db, query_scholarships, get_scholarship_by_id, get_all_scholarships_raw,
    get_dashboard_stats, insert_or_update_scholarship, delete_scholarship_by_id
)
from ml_engine import ml_engine
from recommendation_engine import compute_recommendations_for_profile

# Initialize FastAPI application
app = FastAPI(
    title="ScholarMatch AI API",
    description="Smart Scholarship Eligibility & Recommendation System for Indian Students",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed and initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "message": "ScholarMatch AI Backend API is running successfully!",
        "docs": "/docs",
        "health": "/api/health",
        "scholarships": "/api/scholarships"
    }

@app.get("/api/health")
def health_check():
    stats = get_dashboard_stats()
    return {
        "status": "healthy",
        "service": "ScholarMatch AI REST API",
        "ml_engine": "Random Forest Classifier (n_estimators=100, max_depth=10, random_state=42)",
        "ml_trained": ml_engine.is_trained,
        "database_records": stats["total_scholarships"]
    }

@app.get("/api/stats")
def get_stats():
    return get_dashboard_stats()

@app.get("/api/scholarships")
def list_scholarships(
    q: Optional[str] = Query(None, description="Free text search"),
    education_level: Optional[str] = Query(None, description="Comma-separated education levels"),
    course: Optional[str] = Query(None, description="Comma-separated courses"),
    state: Optional[str] = Query(None, description="State filter"),
    category: Optional[str] = Query(None, description="Comma-separated caste categories"),
    gender: Optional[str] = Query(None, description="Gender filter"),
    provider_type: Optional[str] = Query(None, description="Comma-separated provider types"),
    max_income: Optional[float] = Query(None, description="Max annual family income in INR"),
    min_marks: Optional[float] = Query(None, description="Minimum percentage marks"),
    status: Optional[str] = Query(None, description="Application status"),
    renewal: Optional[str] = Query(None, description="Renewal availability"),
    sort_by: Optional[str] = Query("best_match", description="best_match, deadline, amount, newest"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100)
):
    levels = [x.strip() for x in education_level.split(",")] if education_level else None
    courses = [x.strip() for x in course.split(",")] if course else None
    cats = [x.strip() for x in category.split(",")] if category else None
    providers = [x.strip() for x in provider_type.split(",")] if provider_type else None

    return query_scholarships(
        query=q,
        education_level=levels,
        course=courses,
        state=state,
        category=cats,
        gender=gender,
        provider_type=providers,
        max_income=max_income,
        min_marks=min_marks,
        status=status,
        renewal=renewal,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )

@app.get("/api/scholarships/{scholarship_id}")
def get_scholarship_details(scholarship_id: str):
    res = get_scholarship_by_id(scholarship_id)
    if not res:
        raise HTTPException(status_code=404, detail="Scholarship record not found")
    return res

@app.post("/api/recommendations")
def get_recommendations(profile: StudentProfile, sort_by: str = Query("best_match")):
    """
    Accepts full student profile and executes Random Forest ML inference and
    rule-based constraint checking across the 500+ scholarship database.
    """
    profile_dict = profile.model_dump()
    return compute_recommendations_for_profile(profile_dict, sort_by=sort_by)

@app.post("/api/predict-eligibility")
def predict_eligibility_for_scholarship(payload: Dict[str, Any]):
    """
    Evaluates student profile specifically against a single scholarship or returns
    the ML eligibility vector for audit and explanation.
    """
    profile = payload.get("profile")
    scholarship_id = payload.get("scholarship_id")
    
    if not profile or not scholarship_id:
        raise HTTPException(status_code=400, detail="Both 'profile' and 'scholarship_id' are required")
        
    sch = get_scholarship_by_id(scholarship_id)
    if not sch:
        raise HTTPException(status_code=404, detail="Scholarship not found")
        
    prediction = ml_engine.predict_match(profile, sch)
    return {
        "scholarship_id": scholarship_id,
        "scholarship_name": sch["scholarship_name"],
        "analysis": prediction
    }

@app.post("/api/compare")
def compare_scholarships(req: ComparisonRequest):
    """
    Accepts 2 to 4 scholarship IDs and returns full structured data for side-by-side comparison.
    """
    if len(req.scholarship_ids) < 2 or len(req.scholarship_ids) > 4:
        raise HTTPException(status_code=400, detail="Please select between 2 and 4 scholarships to compare")

    items = []
    for sid in req.scholarship_ids:
        sch = get_scholarship_by_id(sid)
        if sch:
            items.append(sch)
    return {"scholarships": items}

@app.get("/api/deadlines")
def get_deadlines():
    """
    Categorizes active scholarships by deadline urgency:
    Closing Soon (<= 7 days), This Week, This Month (<= 30 days), and Upcoming.
    """
    all_sch = get_all_scholarships_raw()
    
    closing_soon = []
    this_week = []
    this_month = []
    upcoming = []

    for sch in all_sch:
        days = sch.get("days_left", 30)
        if days <= 3:
            closing_soon.append(sch)
        elif days <= 7:
            this_week.append(sch)
        elif days <= 30:
            this_month.append(sch)
        else:
            upcoming.append(sch)

    # Sort each group by days left
    closing_soon.sort(key=lambda s: s.get("days_left", 0))
    this_week.sort(key=lambda s: s.get("days_left", 0))
    this_month.sort(key=lambda s: s.get("days_left", 0))
    upcoming.sort(key=lambda s: s.get("days_left", 0))

    return {
        "closing_soon": closing_soon[:15],
        "this_week": this_week[:15],
        "this_month": this_month[:15],
        "upcoming": upcoming[:15],
        "counts": {
            "closing_soon": len(closing_soon),
            "this_week": len(this_week),
            "this_month": len(this_month),
            "upcoming": len(upcoming)
        }
    }

# ----------------- ADMIN ROUTES -----------------

@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    # Professional demo credentials
    if req.username == "admin" and req.password == "scholarmatch2026":
        return {
            "token": "scholarmatch_jwt_mock_token_admin_987213",
            "username": "admin",
            "role": "Super Admin"
        }
    elif req.username == "admin" and req.password == "admin123":
        return {
            "token": "scholarmatch_jwt_mock_token_admin_987213",
            "username": "admin",
            "role": "Super Admin"
        }
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

@app.post("/api/admin/scholarships")
def create_scholarship(data: Dict[str, Any]):
    required_fields = ["scholarship_name", "provider", "provider_type", "state", "minimum_marks"]
    for field in required_fields:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    new_id = insert_or_update_scholarship(data)
    return {"message": "Scholarship created successfully", "scholarship_id": new_id}

@app.put("/api/admin/scholarships/{scholarship_id}")
def update_scholarship(scholarship_id: str, data: Dict[str, Any]):
    existing = get_scholarship_by_id(scholarship_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Scholarship not found")
        
    data["scholarship_id"] = scholarship_id
    insert_or_update_scholarship(data)
    return {"message": "Scholarship updated successfully", "scholarship_id": scholarship_id}

@app.delete("/api/admin/scholarships/{scholarship_id}")
def delete_scholarship(scholarship_id: str):
    success = delete_scholarship_by_id(scholarship_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return {"message": "Scholarship deleted successfully"}

@app.post("/api/admin/upload-csv")
async def upload_csv_file(file: UploadFile = File(...)):
    """
    Parses an uploaded CSV file, validates fields, and imports records into the database.
    """
    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except Exception:
        decoded = content.decode("latin1")

    reader = csv.DictReader(io.StringIO(decoded))
    imported_count = 0
    errors = []

    for idx, row in enumerate(reader):
        try:
            name = row.get("Scholarship_Name") or row.get("scholarship_name")
            if not name:
                continue
            
            amt = float(row.get("Scholarship_Amount", row.get("scholarship_amount", 25000)))
            record = {
                "scholarship_name": name,
                "provider": row.get("Provider", row.get("provider", "Govt Authority")),
                "provider_type": row.get("Provider_Type", row.get("provider_type", "State Government")),
                "state": row.get("State", row.get("state", "All India")),
                "education_level": row.get("Education_Level", row.get("education_level", "Undergraduate (UG)")),
                "course": row.get("Course", row.get("course", "All")),
                "category": row.get("Category", row.get("category", "All")),
                "gender": row.get("Gender", row.get("gender", "All")),
                "income_limit": float(row.get("Income_Limit", row.get("income_limit", 250000))),
                "minimum_marks": float(row.get("Minimum_Marks", row.get("minimum_marks", 50))),
                "minimum_cgpa": float(row.get("Minimum_CGPA", row.get("minimum_cgpa", 5.0))),
                "scholarship_amount": amt,
                "amount_display": f"₹{int(amt):,} / year",
                "benefits": row.get("Benefits", row.get("benefits", "Tuition fee waiver")),
                "application_start_date": row.get("Application_Start_Date", row.get("application_start_date", "2026-08-01")),
                "application_end_date": row.get("Application_End_Date", row.get("application_end_date", "2026-11-30")),
                "renewal": row.get("Renewal", row.get("renewal", "Yes")),
                "eligibility_criteria": row.get("Eligibility_Criteria", row.get("eligibility_criteria", "")),
                "required_documents": [d.strip() for d in row.get("Required_Documents", "Aadhaar Card, Marksheet, Income Certificate").split(",")],
                "official_website": row.get("Official_Website", "https://scholarships.gov.in"),
                "application_link": row.get("Application_Link", "https://scholarships.gov.in"),
                "status": row.get("Status", "Active"),
                "description": row.get("Description", "")
            }
            insert_or_update_scholarship(record)
            imported_count += 1
        except Exception as e:
            errors.append(f"Row {idx+1}: {str(e)}")

    return {
        "imported_count": imported_count,
        "errors": errors[:5],
        "message": f"Successfully processed CSV and imported {imported_count} records."
    }

# ----------------- STATIC FRONTEND SERVING (PRODUCTION MODE) -----------------
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or root
        if not full_path or full_path == "":
            return FileResponse(os.path.join(frontend_dist, "index.html"))
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
