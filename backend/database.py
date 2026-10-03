"""
ScholarMatch AI - Database Layer
Provides SQLite database integration for querying, filtering, pagination, and admin CRUD
with support for 500+ Indian scholarship records.
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "scholarships.db")
JSON_PATH = os.path.join(os.path.dirname(__file__), "scholarships.json")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scholarships (
        scholarship_id TEXT PRIMARY KEY,
        scholarship_name TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_type TEXT NOT NULL,
        state TEXT NOT NULL,
        education_level TEXT NOT NULL,
        course TEXT NOT NULL,
        category TEXT NOT NULL,
        gender TEXT NOT NULL,
        income_limit REAL NOT NULL,
        minimum_marks REAL NOT NULL,
        minimum_cgpa REAL NOT NULL,
        scholarship_amount REAL NOT NULL,
        amount_display TEXT NOT NULL,
        benefits TEXT,
        application_start_date TEXT,
        application_end_date TEXT,
        renewal TEXT NOT NULL,
        eligibility_criteria TEXT,
        required_documents TEXT, -- JSON array
        official_website TEXT,
        application_link TEXT,
        status TEXT NOT NULL,
        description TEXT,
        tags TEXT -- JSON array
    )
    """)
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state ON scholarships(state)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_provider_type ON scholarships(provider_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON scholarships(category)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_status ON scholarships(status)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_income ON scholarships(income_limit)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_marks ON scholarships(minimum_marks)")
    
    conn.commit()
    
    # Check if empty, seed from scholarships.json or generator
    cursor.execute("SELECT COUNT(*) FROM scholarships")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Database is empty. Populating with 500+ Indian scholarships...")
        from dataset_generator import generate_500_scholarships
        records = generate_500_scholarships()
        
        # Save JSON copy for portability
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
            
        for r in records:
            cursor.execute("""
            INSERT OR REPLACE INTO scholarships (
                scholarship_id, scholarship_name, provider, provider_type, state,
                education_level, course, category, gender, income_limit,
                minimum_marks, minimum_cgpa, scholarship_amount, amount_display,
                benefits, application_start_date, application_end_date, renewal,
                eligibility_criteria, required_documents, official_website,
                application_link, status, description, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["scholarship_id"], r["scholarship_name"], r["provider"], r["provider_type"], r["state"],
                r["education_level"], r["course"], r["category"], r["gender"], float(r["income_limit"]),
                float(r["minimum_marks"]), float(r["minimum_cgpa"]), float(r["scholarship_amount"]), r["amount_display"],
                r.get("benefits", ""), r.get("application_start_date", "2026-07-01"), r.get("application_end_date", "2026-11-30"),
                r.get("renewal", "Yes"), r.get("eligibility_criteria", ""),
                json.dumps(r.get("required_documents", []), ensure_ascii=False),
                r.get("official_website", ""), r.get("application_link", ""),
                r.get("status", "Active"), r.get("description", ""),
                json.dumps(r.get("tags", []), ensure_ascii=False)
            ))
            
        conn.commit()
        print(f"Successfully seeded {len(records)} records into scholarships.db")
        
    conn.close()

def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    d = dict(row)
    if isinstance(d.get("required_documents"), str):
        try:
            d["required_documents"] = json.loads(d["required_documents"])
        except Exception:
            d["required_documents"] = [d["required_documents"]]
    if isinstance(d.get("tags"), str):
        try:
            d["tags"] = json.loads(d["tags"])
        except Exception:
            d["tags"] = []
            
    # Calculate days left dynamically
    end_date_str = d.get("application_end_date")
    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            today = datetime.now().date()
            days = (end_date - today).days
            d["days_left"] = max(0, days)
        except Exception:
            d["days_left"] = 30
    else:
        d["days_left"] = 45

    return d

def get_all_scholarships_raw() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scholarships")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

def get_scholarship_by_id(scholarship_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scholarships WHERE scholarship_id = ?", (scholarship_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row_to_dict(row)
    return None

def query_scholarships(
    query: Optional[str] = None,
    education_level: Optional[List[str]] = None,
    course: Optional[List[str]] = None,
    state: Optional[str] = None,
    category: Optional[List[str]] = None,
    gender: Optional[str] = None,
    provider_type: Optional[List[str]] = None,
    max_income: Optional[float] = None,
    min_marks: Optional[float] = None,
    status: Optional[str] = None,
    renewal: Optional[str] = None,
    sort_by: Optional[str] = "best_match",
    page: int = 1,
    page_size: int = 12
) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    conditions = []
    params = []

    if query:
        q_wildcard = f"%{query}%"
        conditions.append("""(
            scholarship_name LIKE ? OR
            provider LIKE ? OR
            state LIKE ? OR
            course LIKE ? OR
            eligibility_criteria LIKE ? OR
            description LIKE ?
        )""")
        params.extend([q_wildcard] * 6)

    if education_level and len(education_level) > 0:
        level_ors = []
        for lvl in education_level:
            level_ors.append("education_level LIKE ?")
            params.append(f"%{lvl}%")
        conditions.append(f"({' OR '.join(level_ors)})")

    if course and len(course) > 0:
        course_ors = []
        for c in course:
            course_ors.append("course LIKE ?")
            params.append(f"%{c}%")
        conditions.append(f"({' OR '.join(course_ors)})")

    if state and state != "All India" and state != "All":
        conditions.append("(state = ? OR state = 'All India')")
        params.append(state)

    if category and len(category) > 0 and "All" not in category:
        cat_ors = ["category = 'All'"]
        for cat in category:
            cat_ors.append("category LIKE ?")
            params.append(f"%{cat}%")
        conditions.append(f"({' OR '.join(cat_ors)})")

    if gender and gender != "All":
        if gender == "Female":
            conditions.append("(gender = 'All' OR gender = 'Female Only' OR gender = 'Male & Female')")
        elif gender == "Male":
            conditions.append("(gender = 'All' OR gender = 'Male Only' OR gender = 'Male & Female')")

    if provider_type and len(provider_type) > 0:
        p_placeholders = ",".join(["?"] * len(provider_type))
        conditions.append(f"provider_type IN ({p_placeholders})")
        params.extend(provider_type)

    if max_income is not None and max_income > 0:
        conditions.append("(income_limit = 0 OR income_limit >= ?)")
        params.append(max_income)

    if min_marks is not None and min_marks > 0:
        conditions.append("minimum_marks <= ?")
        params.append(min_marks)

    if status and status != "All":
        conditions.append("status = ?")
        params.append(status)

    if renewal and renewal != "All":
        conditions.append("renewal = ?")
        params.append(renewal)

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # Count total
    count_sql = f"SELECT COUNT(*) FROM scholarships {where_clause}"
    cursor.execute(count_sql, params)
    total_count = cursor.fetchone()[0]

    # Order by
    order_clause = "ORDER BY scholarship_name ASC"
    if sort_by == "deadline":
        order_clause = "ORDER BY application_end_date ASC"
    elif sort_by == "amount":
        order_clause = "ORDER BY scholarship_amount DESC"
    elif sort_by == "newest":
        order_clause = "ORDER BY scholarship_id DESC"
    elif sort_by == "best_match":
        order_clause = "ORDER BY minimum_marks DESC, scholarship_amount DESC"

    # Pagination
    limit = max(1, page_size)
    offset = max(0, (page - 1) * limit)

    query_sql = f"SELECT * FROM scholarships {where_clause} {order_clause} LIMIT ? OFFSET ?"
    query_params = list(params) + [limit, offset]

    cursor.execute(query_sql, query_params)
    rows = cursor.fetchall()
    conn.close()

    results = [row_to_dict(r) for r in rows]
    total_pages = (total_count + limit - 1) // limit

    return {
        "items": results,
        "total": total_count,
        "page": page,
        "page_size": limit,
        "total_pages": total_pages
    }

def get_dashboard_stats() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM scholarships")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scholarships WHERE status = 'Active'")
    active = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scholarships WHERE status = 'Closing Soon'")
    closing_soon = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scholarships WHERE provider_type = 'Central Government'")
    central = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scholarships WHERE provider_type = 'State Government'")
    state_gov = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scholarships WHERE provider_type LIKE 'Private%'")
    private_csr = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(scholarship_amount), MAX(scholarship_amount) FROM scholarships")
    avg_amt, max_amt = cursor.fetchone()

    conn.close()

    return {
        "total_scholarships": total,
        "active_scholarships": active,
        "closing_soon_count": closing_soon,
        "central_gov_count": central,
        "state_gov_count": state_gov,
        "private_csr_count": private_csr,
        "avg_scholarship_amount": round(avg_amt or 0, 0),
        "max_scholarship_amount": max_amt or 0
    }

def insert_or_update_scholarship(data: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()

    sch_id = data.get("scholarship_id")
    if not sch_id:
        cursor.execute("SELECT COUNT(*) FROM scholarships")
        cnt = cursor.fetchone()[0]
        sch_id = f"SCH-{cnt + 1:03d}"
        data["scholarship_id"] = sch_id

    req_docs = data.get("required_documents", [])
    if isinstance(req_docs, list):
        req_docs_str = json.dumps(req_docs, ensure_ascii=False)
    else:
        req_docs_str = str(req_docs)

    tags = data.get("tags", [])
    if isinstance(tags, list):
        tags_str = json.dumps(tags, ensure_ascii=False)
    else:
        tags_str = str(tags)

    cursor.execute("""
    INSERT OR REPLACE INTO scholarships (
        scholarship_id, scholarship_name, provider, provider_type, state,
        education_level, course, category, gender, income_limit,
        minimum_marks, minimum_cgpa, scholarship_amount, amount_display,
        benefits, application_start_date, application_end_date, renewal,
        eligibility_criteria, required_documents, official_website,
        application_link, status, description, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sch_id,
        data.get("scholarship_name", "Untitled Scholarship"),
        data.get("provider", "Unknown Provider"),
        data.get("provider_type", "Central Government"),
        data.get("state", "All India"),
        data.get("education_level", "Undergraduate (UG)"),
        data.get("course", "B.Tech / B.E., B.Sc, B.Com"),
        data.get("category", "All"),
        data.get("gender", "All"),
        float(data.get("income_limit", 0)),
        float(data.get("minimum_marks", 50)),
        float(data.get("minimum_cgpa", 5.0)),
        float(data.get("scholarship_amount", 30000)),
        data.get("amount_display", f"₹{int(float(data.get('scholarship_amount', 30000))):,} / year"),
        data.get("benefits", "Direct tuition fee grant"),
        data.get("application_start_date", "2026-07-01"),
        data.get("application_end_date", "2026-11-30"),
        data.get("renewal", "Yes"),
        data.get("eligibility_criteria", "Standard eligibility"),
        req_docs_str,
        data.get("official_website", "https://scholarships.gov.in"),
        data.get("application_link", "https://scholarships.gov.in"),
        data.get("status", "Active"),
        data.get("description", ""),
        tags_str
    ))

    conn.commit()
    conn.close()
    return sch_id

def delete_scholarship_by_id(scholarship_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scholarships WHERE scholarship_id = ?", (scholarship_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0
