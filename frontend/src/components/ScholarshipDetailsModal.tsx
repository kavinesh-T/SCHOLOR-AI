import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  IndianRupee, 
  GraduationCap, 
  MapPin, 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  Bookmark, 
  Scale, 
  Check, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ScholarshipRecord, StudentProfile } from '../types';

interface ScholarshipDetailsModalProps {
  scholarship: ScholarshipRecord | null;
  onClose: () => void;
  onToggleSave: (scholarship: ScholarshipRecord) => void;
  isSaved: boolean;
  onToggleCompare: (scholarship: ScholarshipRecord) => void;
  isCompared: boolean;
  profile?: StudentProfile;
}

export const ScholarshipDetailsModal: React.FC<ScholarshipDetailsModalProps> = ({
  scholarship,
  onClose,
  onToggleSave,
  isSaved,
  onToggleCompare,
  isCompared,
  profile
}) => {
  if (!scholarship) return null;

  // Track student document readiness state for this scholarship
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (doc: string) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  const docs = scholarship.required_documents || [];
  const checkedCount = docs.filter(d => checkedDocs[d]).length;
  const docReadinessPct = docs.length > 0 ? Math.round((checkedCount / docs.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                {scholarship.provider_type}
              </span>
              {scholarship.match_score && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{scholarship.match_score}% Match</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {scholarship.scholarship_name}
            </h2>

            <p className="text-xs text-slate-500 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{scholarship.provider}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onToggleCompare(scholarship)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isCompared ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Compare Scholarship"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleSave(scholarship)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isSaved ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Save Scholarship"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Grant Value</span>
              <span className="text-sm font-bold text-blue-900">{scholarship.amount_display}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Deadline</span>
              <span className="text-sm font-bold text-slate-800">{scholarship.application_end_date}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Min Marks</span>
              <span className="text-sm font-bold text-slate-800">{scholarship.minimum_marks}%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Income Limit</span>
              <span className="text-sm font-bold text-slate-800">
                {scholarship.income_limit > 0 ? `≤ ₹${(scholarship.income_limit / 100000).toFixed(1)} Lakh` : 'No Limit'}
              </span>
            </div>
          </div>

          {/* EXPLAINABLE AI: "Why am I eligible?" */}
          {scholarship.reasons_eligible && scholarship.reasons_eligible.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Explainable AI: Why This Scholarship Matches You</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {scholarship.reasons_eligible.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scholarship.reasons_ineligible && scholarship.reasons_ineligible.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Criteria to Verify</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-900">
                {scholarship.reasons_ineligible.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Scholarship Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Benefits & Financial Coverage</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {scholarship.benefits}
            </p>
          </div>

          {/* Eligibility Criteria Matrix */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Detailed Eligibility Criteria</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block">Education Level & Courses:</span>
                <span className="text-slate-600 mt-0.5 block">{scholarship.education_level} — {scholarship.course}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block">Domicile & Gender:</span>
                <span className="text-slate-600 mt-0.5 block">{scholarship.state} • {scholarship.gender}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block">Caste / Category:</span>
                <span className="text-slate-600 mt-0.5 block">{scholarship.category}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block">Renewal Policy:</span>
                <span className="text-slate-600 mt-0.5 block">{scholarship.renewal === 'Yes' ? 'Renewable annually subject to academic performance' : 'One-time grant'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Required Documents Checklist</h3>
              <span className="text-xs font-semibold text-blue-600">
                Readiness: {docReadinessPct}% ({checkedCount}/{docs.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {docs.map((doc, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleDoc(doc)}
                  className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-colors text-xs ${
                    checkedDocs[doc] 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checkedDocs[doc] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {checkedDocs[doc] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* VERIFY BEFORE APPLYING WARNING CALLOUT */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">Verify Before Applying</p>
              <p className="text-amber-800 leading-relaxed">
                Eligibility requirements, documentation rules, and closing deadlines may change. Always verify the latest information on the official scholarship website before applying.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Applications close: <strong className="text-slate-700">{scholarship.application_end_date}</strong></span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors text-center"
            >
              Close
            </button>

            {/* Official Website CTA */}
            <a
              href={scholarship.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-[1.01]"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
