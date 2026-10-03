from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StudentProfile(BaseModel):
    name: str = Field(default="Priya Sharma", description="Student full name")
    age: int = Field(default=19, ge=12, le=50)
    gender: str = Field(default="Female", description="Gender: Male, Female, Other")
    state: str = Field(default="Maharashtra", description="Domicile state in India")
    district: str = Field(default="Pune", description="District")
    category: str = Field(default="OBC", description="Caste/Social Category: General, OBC, SC, ST, EWS, Minority")
    
    # Academic
    education_level: str = Field(default="Undergraduate (UG)", description="High School (Class 9-10), Higher Secondary (Class 11-12), Diploma, Undergraduate (UG), Postgraduate (PG), PhD / Doctoral")
    course: str = Field(default="B.Tech / B.E.", description="Course/Degree enrolled")
    specialization: str = Field(default="Computer Science & Engineering", description="Specialization or Stream")
    institution_type: str = Field(default="Government / State", description="Government / Central, Government / State, Private / Autonomous, Deemed University")
    current_year: str = Field(default="2nd Year", description="Current year of study")
    percentage_cgpa: float = Field(default=86.5, ge=0.0, le=100.0, description="Current marks percentage or CGPA equivalent")
    previous_marks: float = Field(default=88.0, ge=0.0, le=100.0, description="10th or 12th percentage")
    
    # Financial
    annual_family_income: float = Field(default=220000.0, ge=0.0, description="Annual family income in INR")
    income_certificate: str = Field(default="Available", description="Available, Applied, Not Available")
    parent_employment: str = Field(default="Agriculture / Farming", description="Parent/Guardian Employment Status")
    
    # Additional criteria
    disability_status: str = Field(default="No", description="Yes (PwD >= 40%) or No")
    first_generation: str = Field(default="Yes", description="First generation college student: Yes or No")
    scholarship_already_received: str = Field(default="No", description="Already receiving any scholarship: Yes or No")
    residence_type: str = Field(default="Hosteler", description="Hosteler or Day Scholar")
    single_girl_child: str = Field(default="No", description="Single girl child: Yes or No")
    rural_area: str = Field(default="Yes", description="Hails from rural/backward region: Yes or No")


class ScholarshipFilter(BaseModel):
    query: Optional[str] = None
    education_level: Optional[List[str]] = None
    course: Optional[List[str]] = None
    state: Optional[str] = None
    category: Optional[List[str]] = None
    gender: Optional[str] = None
    provider_type: Optional[List[str]] = None
    max_income: Optional[float] = None
    min_marks: Optional[float] = None
    status: Optional[str] = None
    renewal: Optional[str] = None
    sort_by: Optional[str] = "best_match" # "best_match", "deadline", "amount", "newest"
    page: int = 1
    page_size: int = 12


class ScholarshipRecord(BaseModel):
    scholarship_id: str
    scholarship_name: str
    provider: str
    provider_type: str # Central Government, State Government, Private / Corporate CSR, NGO / Trust
    state: str # State name or "All India"
    education_level: str # comma-separated or list representation
    course: str
    category: str # "All", "General", "OBC", "SC", "ST", "EWS", "Minority"
    gender: str # "All", "Female Only", "Male & Female"
    income_limit: float # in INR (0 = no limit)
    minimum_marks: float # percentage (e.g. 60.0)
    minimum_cgpa: float # out of 10.0 (e.g. 6.0)
    scholarship_amount: float # in INR
    amount_display: str # e.g. "₹50,000 / year"
    benefits: str
    application_start_date: str # YYYY-MM-DD
    application_end_date: str # YYYY-MM-DD
    days_left: Optional[int] = None
    renewal: str # "Yes" or "No"
    eligibility_criteria: str
    required_documents: List[str]
    official_website: str
    application_link: str
    status: str # "Active", "Closing Soon", "Upcoming", "Closed"
    description: str
    tags: List[str] = []
    
    # ML & match fields (populated dynamically when student profile is provided)
    match_score: Optional[int] = None
    eligibility_status: Optional[str] = None # "Eligible", "Check Eligibility", "Not Eligible"
    ml_confidence: Optional[float] = None
    reasons_eligible: Optional[List[str]] = []
    reasons_ineligible: Optional[List[str]] = []
    missing_documents: Optional[List[str]] = []


class ComparisonRequest(BaseModel):
    scholarship_ids: List[str]


class AdminLoginRequest(BaseModel):
    username: str
    password: str
