export interface StudentProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
  education_level: string;
  course: string;
  specialization: string;
  institution_type: string;
  current_year: string;
  percentage_cgpa: number;
  previous_marks: number;
  annual_family_income: number;
  income_certificate: 'Available' | 'Applied' | 'Not Available';
  parent_employment: string;
  disability_status: 'No' | 'Yes (PwD >= 40%)';
  first_generation: 'Yes' | 'No';
  scholarship_already_received: 'Yes' | 'No';
  residence_type: 'Hosteler' | 'Day Scholar';
  single_girl_child: 'Yes' | 'No';
  rural_area: 'Yes' | 'No';
}

export interface ScholarshipRecord {
  scholarship_id: string;
  scholarship_name: string;
  provider: string;
  provider_type: 'Central Government' | 'State Government' | 'Private / Corporate CSR' | 'NGO / Trust';
  state: string;
  education_level: string;
  course: string;
  category: string;
  gender: string;
  income_limit: number;
  minimum_marks: number;
  minimum_cgpa: number;
  scholarship_amount: number;
  amount_display: string;
  benefits?: string;
  application_start_date: string;
  application_end_date: string;
  days_left?: number;
  renewal: string;
  eligibility_criteria: string;
  required_documents: string[];
  official_website: string;
  application_link: string;
  status: 'Active' | 'Closing Soon' | 'Upcoming' | 'Closed';
  description: string;
  tags?: string[];
  
  // Dynamic ML & recommendation fields
  match_score?: number;
  eligibility_status?: 'Eligible' | 'Check Eligibility' | 'Not Eligible';
  ml_confidence?: number;
  reasons_eligible?: string[];
  reasons_ineligible?: string[];
}

export interface RecommendationSummary {
  profile_match_percentage: number;
  eligible_scholarships: number;
  potential_matches: number;
  not_eligible_scholarships: number;
  total_evaluated: number;
  student_name: string;
  academic_tier: string;
}

export interface RecommendationResponse {
  summary: RecommendationSummary;
  recommendations: ScholarshipRecord[];
  message?: string;
}

export interface DashboardStats {
  total_scholarships: number;
  active_scholarships: number;
  closing_soon_count: number;
  central_gov_count: number;
  state_gov_count: number;
  private_csr_count: number;
  avg_scholarship_amount: number;
  max_scholarship_amount: number;
}

export interface DeadlinesData {
  closing_soon: ScholarshipRecord[];
  this_week: ScholarshipRecord[];
  this_month: ScholarshipRecord[];
  upcoming: ScholarshipRecord[];
  counts: {
    closing_soon: number;
    this_week: number;
    this_month: number;
    upcoming: number;
  };
}

export interface FilterState {
  query: string;
  education_levels: string[];
  courses: string[];
  state: string;
  categories: string[];
  gender: string;
  provider_types: string[];
  max_income: number;
  min_marks: number;
  status: string;
  renewal: string;
  sort_by: string;
  page: number;
}

// Convenience alias used by premium UI components
export interface Scholarship extends ScholarshipRecord {
  id: string;
  name?: string;
  scholarship_type?: string;
  amount?: string;
  target_group?: string;
  deadline?: string;
  match_percentage?: number;
  match_reasons?: string[];
  eligible?: boolean;
  official_link?: string;
}

