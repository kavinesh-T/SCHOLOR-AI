import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  X, 
  Clock, 
  HelpCircle, 
  Building2, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { COMMON_DOCUMENTS } from '../data/constants';

export const DocumentChecklist: React.FC = () => {
  // Status: 'Available' | 'Applied' | 'Not Available'
  const [docStatuses, setDocStatuses] = useState<Record<string, 'Available' | 'Applied' | 'Not Available'>>({
    aadhaar: 'Available',
    income_cert: 'Available',
    caste_cert: 'Available',
    bonafide_cert: 'Available',
    marksheets: 'Available',
    bank_passbook: 'Available',
    photo: 'Available',
    domicile: 'Applied',
    pwd_cert: 'Not Available'
  });

  const setStatus = (id: string, status: 'Available' | 'Applied' | 'Not Available') => {
    setDocStatuses(prev => ({ ...prev, [id]: status }));
  };

  // Calculate readiness score
  const total = COMMON_DOCUMENTS.length;
  const availableCount = Object.values(docStatuses).filter(s => s === 'Available').length;
  const appliedCount = Object.values(docStatuses).filter(s => s === 'Applied').length;
  const readinessPct = Math.round(((availableCount + (appliedCount * 0.5)) / total) * 100);

  return (
    <div className="space-y-6 py-6 text-left max-w-4xl mx-auto">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Scholarship Application Preparation</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Document Readiness Checklist
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your mandatory verification certificates organized to prevent last-minute application rejections.
            </p>
          </div>

          {/* Readiness Meter */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl flex items-center space-x-4 self-start sm:self-auto">
            <div className="text-center">
              <span className="text-[10px] text-blue-800 font-semibold uppercase block">Readiness</span>
              <span className="text-3xl font-black text-blue-900">{readinessPct}%</span>
            </div>
            <div className="text-[11px] text-slate-600 border-l border-blue-200 pl-3">
              <p className="font-semibold text-emerald-700">{availableCount} Available</p>
              <p className="text-amber-700">{appliedCount} Applied</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${readinessPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {readinessPct >= 80 
              ? '✓ Great job! Your document package is ready for 90%+ of Indian scholarships.' 
              : '⚠ Keep gathering pending certificates to avoid application deadline rush.'}
          </p>
        </div>
      </div>

      {/* Document Items List */}
      <div className="space-y-3">
        {COMMON_DOCUMENTS.map((doc) => {
          const currentStatus = docStatuses[doc.id] || 'Not Available';
          return (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {doc.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {doc.issuingAuthority}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {doc.description}
                </p>
                <p className="text-[11px] text-blue-600 font-medium">
                  {doc.requiredFor}
                </p>
              </div>

              {/* Status Selector Pills */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setStatus(doc.id, 'Available')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    currentStatus === 'Available'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Available</span>
                </button>

                <button
                  onClick={() => setStatus(doc.id, 'Applied')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    currentStatus === 'Applied'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </button>

                <button
                  onClick={() => setStatus(doc.id, 'Not Available')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    currentStatus === 'Not Available'
                      ? 'bg-slate-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Missing</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advice Callout */}
      <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Pro-tip for Indian Scholarship Portals (NSP / MahaDBT / SSP):</p>
          <p className="text-blue-800 leading-relaxed">
            Ensure your name and date of birth match exactly across your Aadhaar Card, 10th Marksheet, and Bank Passbook. Discrepancies in single initials can cause automated DBT verification rejection.
          </p>
        </div>
      </div>

    </div>
  );
};
