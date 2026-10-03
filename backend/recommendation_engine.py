"""
ScholarMatch AI - Intelligent Hybrid Recommendation Engine
Combines Random Forest machine learning classification with rule-based constraint verification
and Explainable AI reason ranking.
"""

from typing import Dict, Any, List
from ml_engine import ml_engine
from database import get_all_scholarships_raw

def compute_recommendations_for_profile(profile: Dict[str, Any], sort_by: str = "best_match") -> Dict[str, Any]:
    all_scholarships = get_all_scholarships_raw()
    
    # Vectorized fast evaluation across all 500+ scholarships in a single pass
    evaluated_scholarships = ml_engine.batch_evaluate_scholarships(profile, all_scholarships)
    
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

    # Sort
    if sort_by == "best_match":
        evaluated_scholarships.sort(key=lambda s: (s["match_score"], s.get("scholarship_amount", 0)), reverse=True)
    elif sort_by == "deadline":
        evaluated_scholarships.sort(key=lambda s: s.get("days_left", 999))
    elif sort_by == "amount":
        evaluated_scholarships.sort(key=lambda s: s.get("scholarship_amount", 0), reverse=True)
    elif sort_by == "newest":
        evaluated_scholarships.sort(key=lambda s: s.get("scholarship_id", ""), reverse=True)

    if eligible_count > 0:
        top_scores = [s["match_score"] for s in evaluated_scholarships[:10] if s["eligibility_status"] == "Eligible"]
        profile_match_pct = int(sum(top_scores) / len(top_scores)) if top_scores else 88
    else:
        profile_match_pct = 45

    return {
        "summary": {
            "profile_match_percentage": profile_match_pct,
            "eligible_scholarships": eligible_count,
            "potential_matches": potential_count,
            "not_eligible_scholarships": not_eligible_count,
            "total_evaluated": len(evaluated_scholarships),
            "student_name": profile.get("name", "Student"),
            "academic_tier": "Distinction" if float(profile.get("percentage_cgpa", 0)) >= 75 else "Merit"
        },
        "recommendations": evaluated_scholarships
    }
