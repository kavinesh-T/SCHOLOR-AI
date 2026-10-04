"""
ScholarMatch AI - Intelligent Hybrid Recommendation Engine
Combines Random Forest machine learning classification with mandatory rule-based constraint verification
and Explainable AI reason ranking.
"""

from typing import Dict, Any, List
from ml_engine import ml_engine
from database import get_all_scholarships_raw


def check_gender_eligibility(student_gender: str, scholarship: Dict[str, Any]) -> bool:
    """
    Validates gender eligibility safely and case-insensitively.
    Inspects BOTH the explicit gender field AND scholarship name, description, criteria, and tags.
    - Male student: show scholarships with Gender = Male or All; CANNOT receive Female-only or girls/women schemes.
    - Female student: show scholarships with Gender = Female or All; CANNOT receive Male-only schemes.
    - All-gender scholarship: eligible for all students.
    """
    st_g = str(student_gender or "").strip().lower()
    sch_g = str(scholarship.get("gender") or "All").strip().lower()

    # Extract all text associated with scholarship for semantic verification
    text = (
        str(scholarship.get("scholarship_name", "")) + " " +
        str(scholarship.get("description", "")) + " " +
        str(scholarship.get("eligibility_criteria", "")) + " " +
        " ".join(scholarship.get("tags", []) if isinstance(scholarship.get("tags"), list) else [])
    ).lower()

    # Keywords strictly designating women/girls schemes
    female_keywords = [
        "female only", "women in", "for women", "girl students", "for girls",
        "girls in stem", "kanya", "beti", "mahila", "ladli", "women engineer",
        "women higher education", "female candidate", "female applicant"
    ]
    is_female_scheme = (
        any(kw in text for kw in female_keywords) or
        ("female" in sch_g or "girl" in sch_g or "women" in sch_g)
    )

    # Keywords designating boys/male schemes
    male_keywords = ["male only", "boys only", "for boys", "male students only"]
    is_male_scheme = (
        any(kw in text for kw in male_keywords) or
        (("male" in sch_g and not is_female_scheme) or "boy" in sch_g)
    )

    # Explicit co-ed markers
    if "male & female" in text or "both boys and girls" in text:
        is_female_scheme = False
        is_male_scheme = False

    if "female" in st_g or "girl" in st_g or "women" in st_g:
        return not is_male_scheme
    elif "male" in st_g or "boy" in st_g:
        return not is_female_scheme
    else:
        # Non-binary, unspecified, or other
        return not (is_female_scheme or is_male_scheme)


def check_education_level_eligibility(student_ed: str, scholarship_ed: str) -> bool:
    """
    Validates education level eligibility safely and case-insensitively.
    """
    if not scholarship_ed:
        return True
    sch_ed = str(scholarship_ed).strip().lower()
    if sch_ed in ["all", "any", "all levels", "all education levels"]:
        return True
    if not student_ed:
        return True

    st_ed = str(student_ed).strip().lower()
    levels = [lvl.strip().lower() for lvl in sch_ed.split(",")]

    for lvl in levels:
        if st_ed in lvl or lvl in st_ed:
            return True
        if "(" in st_ed and ")" in st_ed:
            short = st_ed[st_ed.find("(") + 1 : st_ed.find(")")].strip()
            if short and (short in lvl or lvl in short):
                return True
        if "(" in lvl and ")" in lvl:
            short_lvl = lvl[lvl.find("(") + 1 : lvl.find(")")].strip()
            if short_lvl and (short_lvl in st_ed or st_ed in short_lvl):
                return True
    return False


def check_course_eligibility(student_course: str, scholarship_course: str) -> bool:
    """
    Validates course eligibility safely and case-insensitively.
    """
    if not scholarship_course:
        return True
    sch_c = str(scholarship_course).strip().lower()
    if sch_c in ["all", "any", "all courses", "all streams", "all degree"]:
        return True
    if not student_course:
        return True

    st_c = str(student_course).strip().lower()
    courses = [c.strip().lower() for c in sch_c.split(",")]

    st_parts = [p.strip().replace(".", "") for p in st_c.split("/")]
    st_clean = st_c.replace(".", "")

    for c in courses:
        c_clean = c.replace(".", "")
        if st_c in c or c in st_c or st_clean in c_clean or c_clean in st_clean:
            return True
        for part in st_parts:
            if part and (part in c_clean or c_clean in part):
                return True
    return False


def check_income_eligibility(student_income: float, income_limit: float) -> bool:
    """
    Validates family income ceiling. If income_limit <= 0, there is no income restriction.
    """
    if income_limit <= 0.0:
        return True
    return student_income <= income_limit


def check_category_eligibility(student_category: str, scholarship_category: str) -> bool:
    """
    Validates caste/social category safely and case-insensitively.
    """
    if not scholarship_category:
        return True
    sch_cat = str(scholarship_category).strip().lower()
    if sch_cat in ["all", "any", "all categories"]:
        return True
    if not student_category:
        return True

    st_cat = str(student_category).strip().lower()
    cats = [c.strip().lower() for c in sch_cat.split(",")]

    for c in cats:
        if c == "all" or st_cat in c or c in st_cat:
            return True
    return False


def check_state_eligibility(student_state: str, scholarship: Dict[str, Any]) -> bool:
    """
    Validates state domicile safely and case-insensitively.
    - If scholarship is for another specific state (e.g. Maharashtra, Karnataka), disqualify.
    - If scholarship has state 'All India' but explicitly targets another specific state, disqualify.
    - Scholarships for student's own state or true 'All India' pass.
    """
    if not student_state:
        return True

    st_s = str(student_state).strip().lower()
    sch_s = str(scholarship.get("state") or "All India").strip().lower()

    # Recognized Indian states
    indian_states = [
        "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh",
        "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka",
        "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram",
        "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu",
        "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal", "delhi"
    ]

    # Explicit state list filtering
    if sch_s not in ["all india", "all", "any", "national", "pan india"]:
        states = [s.strip().lower() for s in sch_s.split(",")]
        matched = False
        for s in states:
            if s in ["all india", "all", "any"] or st_s == s or st_s in s or s in st_s:
                matched = True
                break
        if not matched:
            return False

    # Prevent another state's specific scholarship from slipping through with state='All India'
    name_low = str(scholarship.get("scholarship_name", "")).lower()
    crit_low = str(scholarship.get("eligibility_criteria", "")).lower()

    for other_state in indian_states:
        if other_state != st_s:
            if f"domicile of {other_state}" in crit_low or f"residents of {other_state}" in crit_low or f"govt. of {other_state}" in crit_low:
                return False
            if other_state in name_low and st_s not in name_low:
                return False

    return True


def check_marks_eligibility(student_marks: float, min_marks: float) -> bool:
    """
    Validates academic percentage / CGPA marks requirement.
    """
    if min_marks <= 0.0:
        return True
    return student_marks >= min_marks


def is_mandatory_eligible(profile: Dict[str, Any], scholarship: Dict[str, Any]) -> bool:
    """
    Enforces all mandatory eligibility criteria before a scholarship can be recommended:
    - Gender (Male student cannot receive Female-only or girls/women schemes; Female student cannot receive Male-only)
    - Education Level
    - Course
    - Family Income
    - Category
    - State (Must match domicile state or be valid All-India)
    - Minimum Marks/CGPA
    """
    # 1. Gender check (incorporating keywords and field)
    if not check_gender_eligibility(profile.get("gender"), scholarship):
        return False

    # 2. Education level check
    if not check_education_level_eligibility(profile.get("education_level"), scholarship.get("education_level")):
        return False

    # 3. Course check
    if not check_course_eligibility(profile.get("course"), scholarship.get("course")):
        return False

    # 4. Family income check
    try:
        st_inc = float(profile.get("annual_family_income", 0.0) or 0.0)
    except (ValueError, TypeError):
        st_inc = 0.0

    try:
        limit_inc = float(scholarship.get("income_limit", 0.0) or 0.0)
    except (ValueError, TypeError):
        limit_inc = 0.0

    if not check_income_eligibility(st_inc, limit_inc):
        return False

    # 5. Category check
    if not check_category_eligibility(profile.get("category"), scholarship.get("category")):
        return False

    # 6. State check
    if not check_state_eligibility(profile.get("state"), scholarship):
        return False

    # 7. Minimum marks check
    try:
        st_marks = float(profile.get("percentage_cgpa", 0.0) or 0.0)
    except (ValueError, TypeError):
        st_marks = 0.0

    try:
        min_marks = float(scholarship.get("minimum_marks", 0.0) or 0.0)
    except (ValueError, TypeError):
        min_marks = 0.0

    if not check_marks_eligibility(st_marks, min_marks):
        return False

    return True


def compute_recommendations_for_profile(profile: Dict[str, Any], sort_by: str = "best_match") -> Dict[str, Any]:
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
