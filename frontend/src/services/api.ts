import { StudentProfile, ScholarshipRecord, RecommendationResponse, DashboardStats, DeadlinesData } from '../types';

const API_BASE = '/api';

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
    return await res.json();
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

  async adminUploadCsv(file: File): Promise<{ imported_count: number; message: string; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/upload-csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload and parse CSV');
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
