"""
ScholarMatch AI - Intelligent Hybrid Recommendation Engine
Combines Random Forest machine learning classification with mandatory rule-based constraint verification
and Explainable AI reason ranking.
"""

import re
from typing import Dict, Any, List, Tuple, Optional
from ml_engine import ml_engine
from database import get_all_scholarships_raw

# Recognized unrestricted keyword sets
UNRESTRICTED_GENDERS = {"all", "any", "all gender", "all genders", "any gender", "both", "male & female", "male and female", "open to all"}
UNRESTRICTED_STATES = {"all india", "all", "all states", "any state", "any", "national", "pan india", "open to all"}
UNRESTRICTED_CATEGORIES = {"all", "any", "all categories", "open to all"}
UNRESTRICTED_EDUCATION = {"all", "any", "all levels", "all education levels", "open to all"}
UNRESTRICTED_COURSES = {"all", "any", "all courses", "any course", "all streams", "all degree", "all branches", "open to all"}


def parse_numeric(val: Any) -> float:
    """
    Safely parses numeric, currency, string, and formatted numerical values.
    Handles Indian currency notations (e.g. ₹2,50,000, 2.5 Lakh, 250000.0, Rs. 2,00,000).
    """
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace("₹", "").replace("Rs.", "").replace("Rs", "").replace("INR", "").replace(",", "").strip()
    multiplier = 1.0
    s_low = s.lower()
    if "lakh" in s_low or "lac" in s_low:
        multiplier = 100000.0
        s = re.sub(r'(?i)lakhs?|lacs?', '', s).strip()
    elif "crore" in s_low or "cr" in s_low:
        multiplier = 10000000.0
        s = re.sub(r'(?i)crores?|cr', '', s).strip()
    clean = "".join(ch for ch in s if ch.isdigit() or ch == ".")
    try:
        return float(clean) * multiplier if clean else 0.0
    except (ValueError, TypeError):
        return 0.0


def get_student_marks_and_cgpa(student: Dict[str, Any]) -> Tuple[float, float]:
    """
    Extracts student percentage and CGPA safely.
    Handles whether the student provided CGPA (<= 10.0) or percentage (> 10.0).
    """
    val = parse_numeric(student.get("percentage_cgpa", 0.0))
    if 0.0 < val <= 10.0:
        cgpa = val
        pct = cgpa * 10.0
    else:
        pct = val
        cgpa = pct / 10.0
    return pct, cgpa


def check_gender_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates gender eligibility safely and case-insensitively.
    Inspects BOTH the explicit gender field AND scholarship name, description, criteria, and tags.
    - Male student: show scholarships with Gender = Male or All; NEVER show Female-only scholarships.
    - Female student: show scholarships with Gender = Female or All; NEVER show Male-only scholarships.
    """
    st_g = str(student.get("gender") or "All").strip().lower()
    sch_g = str(scholarship.get("gender") or "All").strip().lower()

    text = (
        str(scholarship.get("scholarship_name", "")) + " " +
        str(scholarship.get("description", "")) + " " +
        str(scholarship.get("eligibility_criteria", "")) + " " +
        " ".join(scholarship.get("tags", []) if isinstance(scholarship.get("tags"), list) else [])
    ).lower()

    female_keywords = [
        "female only", "women in", "for women", "girl students", "for girls",
        "girls in stem", "kanya", "beti", "mahila", "ladli", "women engineer",
        "women higher education", "female candidate", "female applicant"
    ]
    is_female_scheme = (
        any(kw in text for kw in female_keywords) or
        ("female" in sch_g or "girl" in sch_g or "women" in sch_g)
    )

    male_keywords = ["male only", "boys only", "for boys", "male students only"]
    is_male_scheme = (
        any(kw in text for kw in male_keywords) or
        (("male" in sch_g and not is_female_scheme) or "boy" in sch_g)
    )

    if "male & female" in text or "both boys and girls" in text:
        is_female_scheme = False
        is_male_scheme = False

    if "female" in st_g or "girl" in st_g or "women" in st_g:
        if is_male_scheme:
            return False, "Gender mismatch: Scholarship is restricted to male applicants"
    elif "male" in st_g or "boy" in st_g:
        if is_female_scheme:
            return False, "Gender mismatch: Scholarship is restricted to female applicants"
    else:
        if is_female_scheme or is_male_scheme:
            return False, "Gender mismatch"

    return True, None


def check_state_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates state domicile safely and case-insensitively.
    - If scholarship is restricted to a particular state, student must match.
    - If scholarship is All India / All States / Any State / National / Pan India, eligible for all students.
    """
    st_s = str(student.get("state") or "").strip().lower()
    sch_s = str(scholarship.get("state") or "All India").strip().lower()

    if not st_s:
        return True, None

    indian_states = [
        "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh",
        "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka",
        "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram",
        "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu",
        "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal", "delhi"
    ]

    if sch_s in UNRESTRICTED_STATES:
        # Prevent another state's specific scholarship from slipping through with state='All India'
        name_low = str(scholarship.get("scholarship_name", "")).lower()
        crit_low = str(scholarship.get("eligibility_criteria", "")).lower()

        for os in indian_states:
            if os != st_s:
                if f"domicile of {os}" in crit_low or f"residents of {os}" in crit_low or f"govt. of {os}" in crit_low:
                    return False, f"State mismatch: Restricted to residents of {os.title()}"
                if os in name_low and st_s not in name_low:
                    return False, f"State mismatch: Restricted to residents of {os.title()}"
        return True, None

    # Scholarship targets specific states
    states = [s.strip().lower() for s in sch_s.split(",")]
    for s in states:
        if s in UNRESTRICTED_STATES or st_s == s or st_s in s or s in st_s:
            return True, None

    return False, f"State mismatch: Scholarship is restricted to {scholarship.get('state')} residents"


def check_category_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates category filter (SC, ST, OBC, MBC, General, EWS, Minority, etc.).
    If scholarship category is All / Any / All Categories, allows student.
    """
    st_cat = str(student.get("category") or "").strip().lower()
    sch_cat = str(scholarship.get("category") or "All").strip().lower()

    if not st_cat or sch_cat in UNRESTRICTED_CATEGORIES:
        return True, None

    cats = [c.strip().lower() for c in sch_cat.split(",")]
    for c in cats:
        if c in UNRESTRICTED_CATEGORIES:
            return True, None
        if st_cat == c or st_cat in c or c in st_cat:
            return True, None
        # Handle state subcategories (e.g. MBC, BC -> OBC)
        if st_cat in ["mbc", "bc", "sebc"] and ("obc" in c or "backward" in c):
            return True, None
        if st_cat == "obc" and any(x in c for x in ["bc", "mbc", "sebc", "obc"]):
            return True, None

    return False, f"Category mismatch: Scholarship is restricted to {scholarship.get('category')} categories"


def check_education_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates education level eligibility safely and case-insensitively.
    """
    st_ed = str(student.get("education_level") or "").strip().lower()
    sch_ed = str(scholarship.get("education_level") or "All").strip().lower()

    if not st_ed or sch_ed in UNRESTRICTED_EDUCATION:
        return True, None

    levels = [lvl.strip().lower() for lvl in sch_ed.split(",")]
    for lvl in levels:
        if lvl in UNRESTRICTED_EDUCATION or st_ed in lvl or lvl in st_ed:
            return True, None
        if "(" in st_ed and ")" in st_ed:
            short = st_ed[st_ed.find("(") + 1 : st_ed.find(")")].strip()
            if short and (short in lvl or lvl in short):
                return True, None
        if "(" in lvl and ")" in lvl:
            short_lvl = lvl[lvl.find("(") + 1 : lvl.find(")")].strip()
            if short_lvl and (short_lvl in st_ed or st_ed in short_lvl):
                return True, None

    return False, f"Education level mismatch: Scholarship requires {scholarship.get('education_level')}"


def check_course_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates course and branch eligibility safely and flexibly without false matches across unrelated fields.
    """
    st_c = str(student.get("course") or "").strip().lower()
    st_spec = str(student.get("specialization") or "").strip().lower()
    sch_c = str(scholarship.get("course") or "All").strip().lower()

    if not st_c or sch_c in UNRESTRICTED_COURSES:
        return True, None

    courses = [c.strip().lower() for c in sch_c.split(",")]
    st_clean = st_c.replace(".", "")
    st_parts = [p.strip().replace(".", "") for p in st_c.split("/")]

    for c in courses:
        c_clean = c.replace(".", "")
        if c in UNRESTRICTED_COURSES:
            return True, None
        if st_c in c or c in st_c or st_clean in c_clean or c_clean in st_clean:
            return True, None
        for p in st_parts:
            if p and (p in c_clean or c_clean in p):
                return True, None
        # Engineering / B.Tech synonyms
        if any(eng in st_clean for eng in ["btech", "be", "engineering", "cse", "computer"]):
            if any(eng in c_clean for eng in ["btech", "be", "engineering", "technical"]):
                return True, None
        # Medical synonyms
        if any(med in st_clean for med in ["mbbs", "bds", "medical", "doctor"]):
            if any(med in c_clean for med in ["mbbs", "bds", "medical"]):
                return True, None

    return False, f"Course mismatch: Scholarship is restricted to {scholarship.get('course')}"


def check_income_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates family income ceiling. If income_limit <= 0, there is no income restriction.
    """
    st_inc = parse_numeric(student.get("annual_family_income", 0.0))
    limit_inc = parse_numeric(scholarship.get("income_limit", 0.0))

    if limit_inc <= 0.0:
        return True, None

    if st_inc > limit_inc:
        return False, f"Income exceeds limit: Family income (₹{int(st_inc):,}) exceeds maximum limit (₹{int(limit_inc):,})"

    return True, None


def check_marks_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates academic percentage requirements.
    """
    st_pct, st_cgpa = get_student_marks_and_cgpa(student)
    min_marks = parse_numeric(scholarship.get("minimum_marks", 0.0))

    if min_marks > 0.0:
        if st_pct < min_marks and (st_cgpa * 10.0) < min_marks:
            return False, f"Minimum marks not satisfied: Required {min_marks:.1f}%, student has {st_pct:.1f}%"

    return True, None


def check_cgpa_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates minimum CGPA requirements.
    """
    st_pct, st_cgpa = get_student_marks_and_cgpa(student)
    min_cgpa = parse_numeric(scholarship.get("minimum_cgpa", 0.0))

    if min_cgpa > 0.0:
        if st_cgpa < min_cgpa and (st_pct / 10.0) < min_cgpa:
            return False, f"Minimum CGPA not satisfied: Required {min_cgpa:.1f} CGPA, student has {st_cgpa:.1f} CGPA"

    return True, None


def check_disability_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates disability / PwD eligibility requirements.
    """
    text = (
        str(scholarship.get("scholarship_name", "")) + " " +
        str(scholarship.get("eligibility_criteria", ""))
    ).lower()
    is_pwd_scheme = "saksham" in text or "specially abled" in text or "disability not less than" in text or "pwd" in str(scholarship.get("tags", "")).lower()
    if is_pwd_scheme:
        st_pwd = str(student.get("disability_status", "")).strip().lower()
        if "yes" not in st_pwd:
            return False, "Disability requirement not satisfied: Scholarship requires PwD status"
    return True, None


def check_age_filter(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validates student age against explicit criteria limits, if specified.
    """
    st_age = parse_numeric(student.get("age", 0))
    if st_age <= 0:
        return True, None
    crit = (str(scholarship.get("eligibility_criteria", "")) + " " + str(scholarship.get("description", ""))).lower()
    age_matches = re.findall(r'(?:age|below|under|maximum age)\s*(?:<=|less than|is|:)?\s*(\d{2})\s*(?:years|yrs)?', crit)
    for m in age_matches:
        max_age = float(m)
        if 15 <= max_age <= 40:
            if st_age > max_age:
                return False, f"Age limit not satisfied: Maximum permissible age is {int(max_age)} years (student is {int(st_age)})"
    return True, None


def is_eligible(student: Dict[str, Any], scholarship: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Evaluates whether a student satisfies all mandatory eligibility requirements for a scholarship.
    Returns:
        (True, None) if eligible
        (False, rejection_reason) if ineligible
    """
    checks = [
        check_gender_filter,
        check_state_filter,
        check_category_filter,
        check_education_filter,
        check_course_filter,
        check_income_filter,
        check_marks_filter,
        check_cgpa_filter,
        check_disability_filter,
        check_age_filter
    ]
    for check_fn in checks:
        ok, reason = check_fn(student, scholarship)
        if not ok:
            return False, reason
    return True, None


def is_mandatory_eligible(profile: Dict[str, Any], scholarship: Dict[str, Any]) -> bool:
    """
    Backward-compatible boolean wrapper for mandatory eligibility check.
    """
    eligible, _ = is_eligible(profile, scholarship)
    return eligible


def compute_recommendations_for_profile(profile: Dict[str, Any], sort_by: str = "best_match") -> Dict[str, Any]:
    """
    Executes mandatory filtering followed by ML match score calculation, ranking, and deduplication.
    Flow:
        Student Profile -> Mandatory Eligibility Filter -> Eligible Scholarships Only -> Match Score Calculation -> Ranking
    """
    all_scholarships = get_all_scholarships_raw()

    # Step 1: Mandatory eligibility filtering and deduplication (by ID and normalized name)
    seen_ids = set()
    seen_names = set()
    filtered_scholarships = []

    for sch in all_scholarships:
        sch_id = str(sch.get("scholarship_id", "")).strip()
        norm_name = "".join(ch for ch in str(sch.get("scholarship_name", "")).lower() if ch.isalnum())

        if not sch_id or sch_id in seen_ids or norm_name in seen_names:
            continue

        if is_mandatory_eligible(profile, sch):
            seen_ids.add(sch_id)
            seen_names.add(norm_name)
            filtered_scholarships.append(sch)

    # Step 2: Empty state handling when no scholarships satisfy mandatory criteria
    if not filtered_scholarships:
        return {
            "summary": {
                "profile_match_percentage": 0,
                "eligible_scholarships": 0,
                "potential_matches": 0,
                "not_eligible_scholarships": 0,
                "total_evaluated": 0,
                "student_name": profile.get("name", "Student"),
                "academic_tier": "Distinction" if float(profile.get("percentage_cgpa", 0) or 0) >= 75 else "Merit"
            },
            "recommendations": [],
            "message": "No scholarships currently match your mandatory eligibility criteria."
        }

    # Step 3: Vectorized ML evaluation ONLY on scholarships that passed mandatory eligibility
    evaluated_scholarships = ml_engine.batch_evaluate_scholarships(profile, filtered_scholarships)

    eligible_count = 0
    potential_count = 0
    not_eligible_count = 0

    for sch in evaluated_scholarships:
        st = sch.get("eligibility_status")
        if st == "Eligible":
            eligible_count += 1
        elif st == "Check Eligibility":
            potential_count += 1
        else:
            not_eligible_count += 1

    # Step 4: Sort recommendations with state prioritization
    st_state_clean = str(profile.get("state", "")).strip().lower()

    def sort_key(s):
        # Prioritize scholarships belonging to the student's home state (e.g. Tamil Nadu)
        is_home_state = 1 if (st_state_clean and st_state_clean in str(s.get("state", "")).lower() and "all india" not in str(s.get("state", "")).lower()) else 0
        if sort_by == "best_match":
            return (is_home_state, s.get("match_score", 0), s.get("scholarship_amount", 0))
        elif sort_by == "deadline":
            return (is_home_state, -s.get("days_left", 999))
        elif sort_by == "amount":
            return (is_home_state, s.get("scholarship_amount", 0))
        elif sort_by == "newest":
            return (is_home_state, s.get("scholarship_id", ""))
        return (is_home_state, s.get("match_score", 0))

    evaluated_scholarships.sort(key=sort_key, reverse=True)

    if eligible_count > 0:
        top_scores = [s["match_score"] for s in evaluated_scholarships[:10] if s["eligibility_status"] == "Eligible"]
        profile_match_pct = int(sum(top_scores) / len(top_scores)) if top_scores else 88
    else:
        profile_match_pct = evaluated_scholarships[0]["match_score"] if evaluated_scholarships else 0

    return {
        "summary": {
            "profile_match_percentage": profile_match_pct,
            "eligible_scholarships": eligible_count,
            "potential_matches": potential_count,
            "not_eligible_scholarships": not_eligible_count,
            "total_evaluated": len(evaluated_scholarships),
            "student_name": profile.get("name", "Student"),
            "academic_tier": "Distinction" if float(profile.get("percentage_cgpa", 0) or 0) >= 75 else "Merit"
        },
        "recommendations": evaluated_scholarships,
        "message": "Success"
    }
