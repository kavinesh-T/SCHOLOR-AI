import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Building2, 
  IndianRupee, 
  FileText,
  Lock,
  LogOut
} from 'lucide-react';
import { ScholarshipRecord, DashboardStats } from '../types';
import { api } from '../services/api';
import { INDIAN_STATES, COURSES, EDUCATION_LEVELS, CATEGORIES } from '../data/constants';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Partial<ScholarshipRecord> | null>(null);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // CSV Upload State
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await api.adminLogin(username, password);
      setIsAuthenticated(true);
      loadAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid username or password');
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, listData] = await Promise.all([
        api.getStats(),
        api.getScholarships({ q: searchQuery || undefined, page, page_size: 15 })
      ]);
      setStats(sData);
      setScholarships(listData.items);
      setTotalPages(listData.total_pages);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, page, searchQuery]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete scholarship: "${name}"?`)) return;
    try {
      await api.adminDeleteScholarship(id);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleOpenAdd = () => {
    setEditingScholarship({
      scholarship_name: '',
      provider: '',
      provider_type: 'Central Government',
      state: 'All India',
      education_level: 'Undergraduate (UG)',
      course: 'B.Tech / B.E.',
      category: 'All',
      gender: 'All',
      income_limit: 450000,
      minimum_marks: 60,
      minimum_cgpa: 6.0,
      scholarship_amount: 50000,
      amount_display: '₹50,000 / year',
      benefits: 'Tuition fee reimbursement and monthly stipend',
      application_start_date: '2026-08-01',
      application_end_date: '2026-11-30',
      renewal: 'Yes',
      eligibility_criteria: 'Standard Indian merit-cum-means criteria',
      required_documents: ['Aadhaar Card', 'Marksheet', 'Income Certificate', 'College ID'],
      official_website: 'https://scholarships.gov.in',
      application_link: 'https://scholarships.gov.in',
      status: 'Active',
      description: 'A dedicated scholarship scheme providing higher education funding support.'
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: ScholarshipRecord) => {
    setEditingScholarship({ ...sch });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleSaveScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScholarship) return;
    setFormError('');
    setFormSuccess('');

    try {
      if (editingScholarship.scholarship_id) {
        await api.adminUpdateScholarship(editingScholarship.scholarship_id, editingScholarship);
        setFormSuccess('Scholarship updated successfully!');
      } else {
        await api.adminCreateScholarship(editingScholarship);
        setFormSuccess('Scholarship created successfully!');
      }
      setTimeout(() => {
        setIsModalOpen(false);
        loadAdminData();
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Validation error');
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading & validating CSV records...');
    try {
      const res = await api.adminUploadCsv(file);
      setUploadStatus(`Success! ${res.imported_count} records verified and inserted.`);
      loadAdminData();
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  // 1. LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto text-left">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ScholarMatch Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Authorized access to scholarship data, database records, and ML training pipelines.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Demo password: <code className="text-slate-600 font-mono">scholarmatch2026</code> or <code className="text-slate-600 font-mono">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToApp}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              ← Back to Student Platform
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="space-y-8 py-6 text-left max-w-7xl mx-auto px-4">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ScholarMatch Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Scholarship Database Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage scheme data validation, publish new CSR grants, update closing dates, and upload batch datasets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scholarship</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-white text-xs"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium">
          {uploadStatus}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Records</span>
            <div className="text-2xl font-black text-slate-900">{stats.total_scholarships}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Schemes</span>
            <div className="text-2xl font-black text-emerald-700">{stats.active_scholarships}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Closing Soon</span>
            <div className="text-2xl font-black text-red-600">{stats.closing_soon_count}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Central Govt</span>
            <div className="text-2xl font-black text-blue-700">{stats.central_gov_count}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Private &amp; CSR</span>
            <div className="text-2xl font-black text-purple-700">{stats.private_csr_count}</div>
          </div>
        </div>
      )}

      {/* Search Bar for Records */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search records by ID, title, or provider..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</span>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-3.5">ID</th>
              <th className="p-3.5">Scholarship Name</th>
              <th className="p-3.5">Provider</th>
              <th className="p-3.5">State</th>
              <th className="p-3.5">Min Marks</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Deadline</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scholarships.map((sch) => (
              <tr key={sch.scholarship_id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3.5 font-mono font-bold text-blue-700">{sch.scholarship_id}</td>
                <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{sch.scholarship_name}</td>
                <td className="p-3.5 text-slate-600 truncate max-w-[150px]">{sch.provider}</td>
                <td className="p-3.5 text-slate-600">{sch.state}</td>
                <td className="p-3.5 font-semibold text-slate-800">{sch.minimum_marks}%</td>
                <td className="p-3.5 font-bold text-blue-900">{sch.amount_display}</td>
                <td className="p-3.5 text-slate-600">{sch.application_end_date}</td>
                <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                  <button
                    onClick={() => handleOpenEdit(sch)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                    title="Edit record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sch.scholarship_id, sch.scholarship_name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-xs">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="font-semibold text-slate-600">Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* ADD / EDIT SCHOLARSHIP MODAL */}
      {isModalOpen && editingScholarship && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingScholarship.scholarship_id ? `Edit ${editingScholarship.scholarship_id}` : 'Create New Scholarship'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveScholarship} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scholarship Title *</label>
                <input
                  type="text"
                  required
                  value={editingScholarship.scholarship_name || ''}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, scholarship_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provider *</label>
                  <input
                    type="text"
                    required
                    value={editingScholarship.provider || ''}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provider Type *</label>
                  <select
                    value={editingScholarship.provider_type || 'Central Government'}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, provider_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Central Government">Central Government</option>
                    <option value="State Government">State Government</option>
                    <option value="Private / Corporate CSR">Private / Corporate CSR</option>
                    <option value="NGO / Trust">NGO / Trust</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={editingScholarship.state || 'All India'}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Marks (%)</label>
                  <input
                    type="number"
                    value={editingScholarship.minimum_marks || 60}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, minimum_marks: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Income Limit (₹)</label>
                  <input
                    type="number"
                    value={editingScholarship.income_limit || 0}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, income_limit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scholarship Amount (₹)</label>
                  <input
                    type="number"
                    value={editingScholarship.scholarship_amount || 50000}
                    onChange={(e) => setEditingScholarship({ 
                      ...editingScholarship, 
                      scholarship_amount: parseFloat(e.target.value) || 0,
                      amount_display: `₹${parseInt(e.target.value || '0').toLocaleString('en-IN')} / year`
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={editingScholarship.application_end_date || '2026-11-30'}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, application_end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Application Link</label>
                <input
                  type="url"
                  value={editingScholarship.application_link || 'https://scholarships.gov.in'}
                  onChange={(e) => setEditingScholarship({ ...editingScholarship, application_link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Save Scholarship Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
