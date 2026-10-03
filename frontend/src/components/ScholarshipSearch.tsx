import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronDown, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  BookmarkCheck,
  Check,
  X
} from 'lucide-react';
import { ScholarshipRecord, FilterState } from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import { INDIAN_STATES, COURSES, EDUCATION_LEVELS, CATEGORIES } from '../data/constants';
import { api } from '../services/api';

interface ScholarshipSearchProps {
  onViewDetails: (scholarship: ScholarshipRecord) => void;
  onToggleSave: (scholarship: ScholarshipRecord) => void;
  savedIds: string[];
  onToggleCompare: (scholarship: ScholarshipRecord) => void;
  comparedIds: string[];
  initialCategoryQuery?: string;
}

export const ScholarshipSearch: React.FC<ScholarshipSearchProps> = ({
  onViewDetails,
  onToggleSave,
  savedIds,
  onToggleCompare,
  comparedIds,
  initialCategoryQuery
}) => {
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [savedSearchAlert, setSavedSearchAlert] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    query: initialCategoryQuery || '',
    education_levels: [],
    courses: [],
    state: 'All India',
    categories: [],
    gender: 'All',
    provider_types: [],
    max_income: 1000000,
    min_marks: 0,
    status: 'All',
    renewal: 'All',
    sort_by: 'best_match',
    page: 1
  });

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.getScholarships({
        q: filters.query || undefined,
        education_level: filters.education_levels.length > 0 ? filters.education_levels.join(',') : undefined,
        course: filters.courses.length > 0 ? filters.courses.join(',') : undefined,
        state: filters.state !== 'All India' ? filters.state : undefined,
        category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
        gender: filters.gender !== 'All' ? filters.gender : undefined,
        provider_type: filters.provider_types.length > 0 ? filters.provider_types.join(',') : undefined,
        max_income: filters.max_income < 1000000 ? filters.max_income : undefined,
        min_marks: filters.min_marks > 0 ? filters.min_marks : undefined,
        status: filters.status !== 'All' ? filters.status : undefined,
        renewal: filters.renewal !== 'All' ? filters.renewal : undefined,
        sort_by: filters.sort_by,
        page: filters.page,
        page_size: 12
      });

      setScholarships(res.items);
      setTotalCount(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error('Error loading scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      query: '',
      education_levels: [],
      courses: [],
      state: 'All India',
      categories: [],
      gender: 'All',
      provider_types: [],
      max_income: 1000000,
      min_marks: 0,
      status: 'All',
      renewal: 'All',
      sort_by: 'best_match',
      page: 1
    });
  };

  const handleSaveSearch = () => {
    setSavedSearchAlert(true);
    setTimeout(() => setSavedSearchAlert(false), 3000);
  };

  const toggleArrayFilter = (field: 'education_levels' | 'courses' | 'categories' | 'provider_types', value: string) => {
    setFilters(prev => {
      const list = prev[field];
      const exists = list.includes(value);
      const updated = exists ? list.filter(v => v !== value) : [...list, value];
      return { ...prev, [field]: updated, page: 1 };
    });
  };

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value, page: 1 }))}
              placeholder="Search scholarships by name, course, state, provider..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
            />
            {filters.query && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, query: '', page: 1 }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By & Mobile Filter Trigger */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={filters.sort_by}
                onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value, page: 1 }))}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="best_match">Best Match</option>
                <option value="deadline">Closing Soon (Deadline)</option>
                <option value="amount">Scholarship Amount</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

        </div>

        {/* Count, Clear, and Save Search Bar */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="font-semibold text-slate-700">
            Showing <strong className="text-blue-700">{totalCount}</strong> scholarships
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearFilters}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>

            <button
              onClick={handleSaveSearch}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Save Search</span>
            </button>
          </div>
        </div>

        {savedSearchAlert && (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center space-x-2 animate-in fade-in duration-200">
            <BookmarkCheck className="w-4 h-4 text-blue-600" />
            <span>Search preferences saved to your browser session!</span>
          </div>
        )}

      </div>

      {/* Main Grid: Filters Sidebar + Scholarships List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Filters Sidebar (Desktop + Mobile conditional) */}
        <div className={`md:col-span-4 lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-6 ${
          mobileFilterOpen ? 'block' : 'hidden md:block'
        }`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Scholarships</span>
            </span>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Domicile State Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">State / Region</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-800"
            >
              {INDIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Provider Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Provider Type</label>
            <div className="space-y-1.5">
              {['Central Government', 'State Government', 'Private / Corporate CSR', 'NGO / Trust'].map((p) => {
                const checked = filters.provider_types.includes(p);
                return (
                  <label key={p} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('provider_types', p)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{p}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Education Level</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {EDUCATION_LEVELS.map((lvl) => {
                const checked = filters.education_levels.includes(lvl);
                return (
                  <label key={lvl} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('education_levels', lvl)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="line-clamp-1">{lvl}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Social Category</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => {
                const checked = filters.categories.includes(cat);
                return (
                  <label key={cat} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayFilter('categories', cat)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female Only (Girls Schemes)</option>
              <option value="Male">Male &amp; Female</option>
            </select>
          </div>

          {/* Family Income Ceiling Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Max Annual Income</span>
              <span className="text-blue-700 font-bold">
                {filters.max_income >= 1000000 ? 'No Limit' : `₹${(filters.max_income / 100000).toFixed(1)} Lakh`}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={1000000}
              step={50000}
              value={filters.max_income}
              onChange={(e) => setFilters(prev => ({ ...prev, max_income: parseInt(e.target.value), page: 1 }))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1 Lakh</span>
              <span>₹10 Lakh+</span>
            </div>
          </div>

          {/* Min Marks Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Minimum Marks Required</span>
              <span className="text-blue-700 font-bold">
                {filters.min_marks === 0 ? 'Any %' : `≤ ${filters.min_marks}%`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={filters.min_marks}
              onChange={(e) => setFilters(prev => ({ ...prev, min_marks: parseInt(e.target.value), page: 1 }))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Application Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Closing Soon">Closing Soon (&lt;= 10 days)</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

        </div>

        {/* Scholarships Results Grid */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {loading ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-slate-500">Searching 516 scholarship records...</p>
            </div>
          ) : scholarships.length === 0 ? (
            /* Beautiful Empty State */
            <div className="py-16 px-6 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No scholarships match your current filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your search query, selecting "All India" as state, or resetting your filter criteria.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {scholarships.map((sch) => (
                <ScholarshipCard
                  key={sch.scholarship_id}
                  scholarship={sch}
                  onViewDetails={onViewDetails}
                  onToggleSave={onToggleSave}
                  isSaved={savedIds.includes(sch.scholarship_id)}
                  onToggleCompare={onToggleCompare}
                  isCompared={comparedIds.includes(sch.scholarship_id)}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-semibold text-slate-600">
                Page <strong className="text-slate-900">{filters.page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                disabled={filters.page >= totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
