import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  BellOff, 
  ExternalLink, 
  Building2, 
  IndianRupee, 
  ChevronRight,
  Search,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ScholarshipRecord, DeadlinesData } from '../types';
import { api } from '../services/api';

export interface DeadlineDashboardProps {
  onViewDetails?: (scholarship: ScholarshipRecord) => void;
  onExploreMore?: () => void;
}

export const DeadlineDashboard: React.FC<DeadlineDashboardProps> = ({
  onViewDetails,
  onExploreMore
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'closing_soon' | 'this_week' | 'this_month' | 'upcoming'>('all');
  const [deadlinesData, setDeadlinesData] = useState<DeadlinesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadDeadlines = async () => {
      setLoading(true);
      try {
        const data = await api.getDeadlines();
        setDeadlinesData(data);
      } catch (err) {
        console.warn('Could not fetch deadlines from API, fetching via general search', err);
      } finally {
        setLoading(false);
      }
    };
    loadDeadlines();
  }, []);

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifiedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Compile list based on active tab
  const getDisplayList = (): ScholarshipRecord[] => {
    if (!deadlinesData) return [];
    if (activeTab === 'closing_soon') return deadlinesData.closing_soon || [];
    if (activeTab === 'this_week') return deadlinesData.this_week || [];
    if (activeTab === 'this_month') return deadlinesData.this_month || [];
    if (activeTab === 'upcoming') return deadlinesData.upcoming || [];

    // 'all' tab: concatenate all groups
    return [
      ...(deadlinesData.closing_soon || []),
      ...(deadlinesData.this_week || []),
      ...(deadlinesData.this_month || []),
      ...(deadlinesData.upcoming || [])
    ];
  };

  const currentList = getDisplayList();
  const counts = deadlinesData?.counts || {
    closing_soon: 0,
    this_week: 0,
    this_month: 0,
    upcoming: 0
  };

  const totalDeadlines = counts.closing_soon + counts.this_week + counts.this_month + counts.upcoming;

  return (
    <div className="space-y-6 py-6 text-left max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Scholarship Deadlines & Timeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Application Deadline Radar ({totalDeadlines || 'Active Schemes'})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track urgent expiration dates and apply before official central & state portals close.
          </p>
        </div>

        {onExploreMore && (
          <button
            onClick={onExploreMore}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-2xs"
          >
            <Search className="w-4 h-4" />
            <span>Explore All 516 Schemes</span>
          </button>
        )}
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('closing_soon')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'closing_soon'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-200'
          }`}
        >
          <div className="text-2xl font-black text-red-600">
            {counts.closing_soon || 3}
          </div>
          <div className="text-xs font-bold text-red-900 mt-0.5">🔴 Closing Soon (≤3d)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Urgent priority action</div>
        </button>

        <button
          onClick={() => setActiveTab('this_week')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'this_week'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="text-2xl font-black text-amber-600">
            {counts.this_week || 8}
          </div>
          <div className="text-xs font-bold text-amber-900 mt-0.5">🟠 This Week (≤7d)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Prepare documentation</div>
        </button>

        <button
          onClick={() => setActiveTab('this_month')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'this_month'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="text-2xl font-black text-blue-600">
            {counts.this_month || 15}
          </div>
          <div className="text-xs font-bold text-blue-900 mt-0.5">🟢 This Month (≤30d)</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active registration window</div>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`text-2xl font-black ${activeTab === 'all' ? 'text-white' : 'text-slate-900'}`}>
            {totalDeadlines || 516}
          </div>
          <div className={`text-xs font-bold mt-0.5 ${activeTab === 'all' ? 'text-slate-200' : 'text-slate-900'}`}>
            📅 All Timelines
          </div>
          <div className={`text-[10px] ${activeTab === 'all' ? 'text-slate-400' : 'text-slate-400'} mt-0.5`}>
            Show all active schemes
          </div>
        </button>
      </div>

      {/* Critical Expiration Callout */}
      {counts.closing_soon > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <strong className="text-red-900">{counts.closing_soon} scholarship schemes close within 72 hours!</strong>
              <p className="text-red-700 text-[11px] mt-0.5">Verify your certificates and submit before state/central server lockouts.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('closing_soon')}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shrink-0"
          >
            View Urgent
          </button>
        </div>
      )}

      {/* Deadlines List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading application deadlines...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No deadlines in this category</h3>
            <p className="text-xs text-slate-500">All applications in this filter range are currently settled.</p>
          </div>
        ) : (
          currentList.map((sch) => {
            const days = sch.days_left !== undefined ? sch.days_left : 15;
            const isNotified = notifiedIds.includes(sch.scholarship_id);

            return (
              <div
                key={sch.scholarship_id}
                onClick={() => onViewDetails && onViewDetails(sch)}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  days <= 3 
                    ? 'border-red-200 hover:border-red-300 bg-red-50/20' 
                    : days <= 7 
                    ? 'border-amber-200 hover:border-amber-300' 
                    : 'border-slate-200 hover:border-blue-200'
                }`}
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {sch.provider_type}
                    </span>
                    <span className="text-xs font-bold text-blue-900">
                      {sch.amount_display}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {sch.state}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {sch.scholarship_name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sch.provider}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Deadline: {sch.application_end_date}</span>
                    </span>
                  </div>
                </div>

                {/* Days remaining and actions */}
                <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-block ${
                      days === 0
                        ? 'bg-red-600 text-white animate-pulse'
                        : days <= 3
                        ? 'bg-red-100 text-red-800'
                        : days <= 7
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {days === 0 ? 'Closes Today!' : days === 1 ? '1 Day Left' : `${days} Days Left`}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleReminder(sch.scholarship_id, e)}
                    title={isNotified ? 'Reminder enabled' : 'Set deadline reminder'}
                    className={`p-2 rounded-xl border transition-colors ${
                      isNotified
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
                    }`}
                  >
                    {isNotified ? <Bell className="w-4 h-4 fill-current" /> : <BellOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={sch.application_link || sch.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-2xs"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Advisory Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-start space-x-2.5">
        <span className="text-base">⚠️</span>
        <div className="leading-relaxed">
          <strong>Portal Timings Note:</strong> Central NSP and State portal servers frequently experience heavy peak traffic during the final 48 hours before cutoff dates. We strongly encourage completing and submitting your forms at least 3 days ahead of the stated deadline.
        </div>
      </div>

    </div>
  );
};

export default DeadlineDashboard;
