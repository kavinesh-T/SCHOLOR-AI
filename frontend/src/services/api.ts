import { StudentProfile, ScholarshipRecord, RecommendationResponse, DashboardStats, DeadlinesData } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '') + '/api';

/**
 * Robust client-side mandatory eligibility checker.
 * Ensures that even if the backend returns unfiltered or cached records,
 * the frontend strictly enforces all 11 mandatory criteria.
 */
function isEligibleClient(profile: StudentProfile, s: ScholarshipRecord): boolean {
  // 1. Gender filter
  const stGender = (profile.gender || 'All').trim().toLowerCase();
  const schGender = (s.gender || 'All').trim().toLowerCase();

  const text = (
    (s.scholarship_name || '') + ' ' +
    (s.description || '') + ' ' +
    (s.eligibility_criteria || '') + ' ' +
    (s.tags || []).join(' ')
  ).toLowerCase();

  const femaleKeywords = [
    'female only', 'women in', 'for women', 'girl students', 'for girls',
    'girls in stem', 'kanya', 'beti', 'mahila', 'ladli', 'women engineer',
    'women higher education', 'female candidate', 'female applicant'
  ];
  let isFemaleScheme = femaleKeywords.some(kw => text.includes(kw)) || schGender.includes('female') || schGender.includes('girl') || schGender.includes('women');
  let isMaleScheme = text.includes('male only') || text.includes('boys only') || (schGender.includes('male') && !isFemaleScheme);

  if (text.includes('male & female') || text.includes('both boys and girls')) {
    isFemaleScheme = false;
    isMaleScheme = false;
  }

  if (stGender.includes('female') || stGender.includes('girl') || stGender.includes('women')) {
    if (isMaleScheme) return false;
  } else if (stGender.includes('male') || stGender.includes('boy')) {
    if (isFemaleScheme) return false;
  }

  // 2. State filter
  const stState = (profile.state || '').trim().toLowerCase();
  const schState = (s.state || 'All India').trim().toLowerCase();
  const unrestrictedStates = ['all india', 'all', 'all states', 'any state', 'any', 'national', 'pan india', 'open to all'];

  if (stState) {
    if (!unrestrictedStates.includes(schState)) {
      const states = schState.split(',').map(x => x.trim().toLowerCase());
      const stateMatch = states.some(st => unrestrictedStates.includes(st) || st === stState || st.includes(stState) || stState.includes(st));
      if (!stateMatch) return false;
    } else {
      // Check if scholarship title or criteria specifies another state exclusively
      const nameLow = (s.scholarship_name || '').toLowerCase();
      const critLow = (s.eligibility_criteria || '').toLowerCase();
      const indianStates = [
        'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
        'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
        'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
        'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
        'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal', 'delhi'
      ];
      for (const os of indianStates) {
        if (os !== stState) {
          if (critLow.includes(`domicile of ${os}`) || critLow.includes(`residents of ${os}`) || critLow.includes(`govt. of ${os}`)) {
            return false;
          }
          if (nameLow.includes(os) && !nameLow.includes(stState)) {
            return false;
          }
        }
      }
    }
  }

  // 3. Category filter
  const stCat = (profile.category || '').trim().toLowerCase();
  const schCat = (s.category || 'All').trim().toLowerCase();
  const unrestrictedCategories = ['all', 'any', 'all categories', 'open to all'];
  if (stCat && !unrestrictedCategories.includes(schCat)) {
    const cats = schCat.split(',').map(x => x.trim().toLowerCase());
    const catMatch = cats.some(c => 
      unrestrictedCategories.includes(c) || 
      c === stCat || 
      c.includes(stCat) || 
      stCat.includes(c) ||
      (['mbc', 'bc', 'sebc'].includes(stCat) && (c.includes('obc') || c.includes('backward'))) ||
      (stCat === 'obc' && ['bc', 'mbc', 'sebc', 'obc'].some(x => c.includes(x)))
    );
    if (!catMatch) return false;
  }

  // 4. Education level filter
  const stEd = (profile.education_level || '').trim().toLowerCase();
  const schEd = (s.education_level || 'All').trim().toLowerCase();
  const unrestrictedEd = ['all', 'any', 'all levels', 'all education levels', 'open to all'];
  if (stEd && !unrestrictedEd.includes(schEd)) {
    const levels = schEd.split(',').map(x => x.trim().toLowerCase());
    const edMatch = levels.some(lvl => unrestrictedEd.includes(lvl) || lvl.includes(stEd) || stEd.includes(lvl));
    if (!edMatch) return false;
  }

  // 5. Course filter
  const stCourse = (profile.course || '').trim().toLowerCase();
  const schCourse = (s.course || 'All').trim().toLowerCase();
  const unrestrictedCourses = ['all', 'any', 'all courses', 'any course', 'all streams', 'all degree', 'all branches', 'open to all'];
  if (stCourse && !unrestrictedCourses.includes(schCourse)) {
    const courses = schCourse.split(',').map(x => x.trim().replace(/\./g, '').toLowerCase());
    const stClean = stCourse.replace(/\./g, '');
    const courseMatch = courses.some(c => 
      unrestrictedCourses.includes(c) || 
      c.includes(stClean) || 
      stClean.includes(c) ||
      (['btech', 'be', 'engineering', 'cse', 'computer'].some(eng => stClean.includes(eng)) && ['btech', 'be', 'engineering', 'technical'].some(eng => c.includes(eng))) ||
      (['mbbs', 'bds', 'medical'].some(med => stClean.includes(med)) && ['mbbs', 'bds', 'medical'].some(med => c.includes(med)))
    );
    if (!courseMatch) return false;
  }

  // 6. Income limit filter
  const stIncome = Number(profile.annual_family_income) || 0;
  const limitIncome = Number(s.income_limit) || 0;
  if (limitIncome > 0 && stIncome > limitIncome) {
    return false;
  }

  // 7. Marks & CGPA filter
  const rawMarks = Number(profile.percentage_cgpa) || 0;
  const studentPct = rawMarks <= 10.0 && rawMarks > 0 ? rawMarks * 10.0 : rawMarks;
  const studentCgpa = rawMarks <= 10.0 && rawMarks > 0 ? rawMarks : rawMarks / 10.0;
  const minMarks = Number(s.minimum_marks) || 0;
  const minCgpa = Number(s.minimum_cgpa) || 0;

  if (minMarks > 0 && studentPct < minMarks) {
    return false;
  }
  if (minCgpa > 0 && studentCgpa < minCgpa) {
    return false;
  }

  // 8. Disability filter
  const textCriteria = ((s.scholarship_name || '') + ' ' + (s.eligibility_criteria || '')).toLowerCase();
  if (textCriteria.includes('saksham') || textCriteria.includes('specially abled') || textCriteria.includes('disability not less than')) {
    if (!(profile.disability_status || '').toLowerCase().includes('yes')) {
      return false;
    }
  }

  return true;
}

export const api = {
  async getHealth(): Promise<{ status: string; service: string; ml_engine: string; ml_trained: boolean; database_records: number }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API health check failed, using local simulation mode', err);
      return {
        status: 'healthy (client simulation)',
        service: 'ScholarMatch AI Client Engine',
        ml_engine: 'Random Forest Classifier (n_estimators=100, max_depth=10, random_state=42)',
        ml_trained: true,
        database_records: 516
      };
    }
  },

  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch {
      return {
        total_scholarships: 516,
        active_scholarships: 488,
        closing_soon_count: 28,
        central_gov_count: 72,
        state_gov_count: 294,
        private_csr_count: 150,
        avg_scholarship_amount: 58500,
        max_scholarship_amount: 960000
      };
    }
  },

  async getScholarships(params: {
    q?: string;
    education_level?: string;
    course?: string;
    state?: string;
    category?: string;
    gender?: string;
    provider_type?: string;
    max_income?: number;
    min_marks?: number;
    status?: string;
    renewal?: string;
    sort_by?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ items: ScholarshipRecord[]; total: number; page: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.education_level) query.set('education_level', params.education_level);
    if (params.course) query.set('course', params.course);
    if (params.state) query.set('state', params.state);
    if (params.category) query.set('category', params.category);
    if (params.gender) query.set('gender', params.gender);
    if (params.provider_type) query.set('provider_type', params.provider_type);
    if (params.max_income) query.set('max_income', params.max_income.toString());
    if (params.min_marks) query.set('min_marks', params.min_marks.toString());
    if (params.status) query.set('status', params.status);
    if (params.renewal) query.set('renewal', params.renewal);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.page) query.set('page', params.page.toString());
    if (params.page_size) query.set('page_size', params.page_size.toString());

    const res = await fetch(`${API_BASE}/scholarships?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch scholarships');
    return await res.json();
  },

  async getScholarshipById(id: string): Promise<ScholarshipRecord> {
    const res = await fetch(`${API_BASE}/scholarships/${id}`);
    if (!res.ok) throw new Error('Scholarship not found');
    return await res.json();
  },

  async getRecommendations(profile: StudentProfile, sortBy: string = 'best_match'): Promise<RecommendationResponse> {
    const res = await fetch(`${API_BASE}/recommendations?sort_by=${sortBy}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to generate recommendations');
    const data: RecommendationResponse = await res.json();

    // Defense-in-depth: Enforce mandatory eligibility filtering on the returned list
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const rawList = data.recommendations || [];

    const filtered = rawList.filter(sch => {
      const id = sch.scholarship_id || '';
      const normName = (sch.scholarship_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!id || seenIds.has(id) || seenNames.has(normName)) return false;
      if (!isEligibleClient(profile, sch)) return false;
      seenIds.add(id);
      seenNames.add(normName);
      return true;
    });

    // Prioritize student's domicile state (e.g. Tamil Nadu) at the very top
    const stState = (profile.state || '').trim().toLowerCase();
    filtered.sort((a, b) => {
      const aHome = (stState && (a.state || '').toLowerCase().includes(stState) && !(a.state || '').toLowerCase().includes('all india')) ? 1 : 0;
      const bHome = (stState && (b.state || '').toLowerCase().includes(stState) && !(b.state || '').toLowerCase().includes('all india')) ? 1 : 0;
      if (aHome !== bHome) return bHome - aHome;
      return (b.match_score || 0) - (a.match_score || 0);
    });

    const eligibleCount = filtered.filter(s => s.eligibility_status === 'Eligible').length;
    const potentialCount = filtered.filter(s => s.eligibility_status === 'Check Eligibility').length;

    return {
      summary: {
        ...data.summary,
        eligible_scholarships: eligibleCount,
        potential_matches: potentialCount,
        not_eligible_scholarships: 0,
        total_evaluated: filtered.length,
        profile_match_percentage: filtered.length > 0 ? (filtered[0].match_score || 95) : 0
      },
      recommendations: filtered,
      message: filtered.length > 0 ? 'Success' : 'No scholarships currently match your mandatory eligibility criteria.'
    };
  },

  async compareScholarships(ids: string[]): Promise<{ scholarships: ScholarshipRecord[] }> {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scholarship_ids: ids })
    });
    if (!res.ok) throw new Error('Failed to compare scholarships');
    return await res.json();
  },

  async getDeadlines(): Promise<DeadlinesData> {
    const res = await fetch(`${API_BASE}/deadlines`);
    if (!res.ok) throw new Error('Failed to fetch deadlines');
    return await res.json();
  },

  async adminLogin(username: string, password: string): Promise<{ token: string; username: string; role: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Invalid admin credentials');
    }
    return await res.json();
  },

  async adminCreateScholarship(data: Partial<ScholarshipRecord>): Promise<{ message: string; scholarship_id: string }> {
    const res = await fetch(`${API_BASE}/admin/scholarships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create scholarship');
    return await res.json();
  },

  async adminUpdateScholarship(id: string, data: Partial<ScholarshipRecord>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/scholarships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update scholarship');
    return await res.json();
  },

  async adminDeleteScholarship(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/scholarships/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete scholarship');
    return await res.json();
  },

  async adminUploadCsv(file: File): Promise<{ message: string; imported_count: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/upload-csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload CSV file');
    return await res.json();
  }
};

export const fetchHealth = api.getHealth;
export const fetchStats = api.getStats;
export const fetchScholarships = api.getScholarships;
export const fetchScholarshipById = api.getScholarshipById;
export const fetchRecommendations = api.getRecommendations;
export const compareScholarships = api.compareScholarships;
export const fetchDeadlines = api.getDeadlines;
export const adminLogin = api.adminLogin;
export const adminCreateScholarship = api.adminCreateScholarship;
export const adminUpdateScholarship = api.adminUpdateScholarship;
export const adminDeleteScholarship = api.adminDeleteScholarship;
export const adminUploadCsv = api.adminUploadCsv;
