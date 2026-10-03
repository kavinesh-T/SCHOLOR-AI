import React from 'react';
import { 
  Scale, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  IndianRupee, 
  Calendar, 
  GraduationCap, 
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ScholarshipRecord } from '../types';

interface ScholarshipComparisonProps {
  scholarships: ScholarshipRecord[];
  onRemove: (scholarshipId: string) => void;
  onClear: () => void;
  onViewDetails: (scholarship: ScholarshipRecord) => void;
  onExploreMore: () => void;
}

export const ScholarshipComparison: React.FC<ScholarshipComparisonProps> = ({
  scholarships,
  onRemove,
  onClear,
  onViewDetails,
  onExploreMore
}) => {
  if (scholarships.length === 0) {
    return (
      <div className="py-20 px-6 text-center space-y-4 bg-white rounded-3xl border border-slate-200 max-w-3xl mx-auto my-6 shadow-xs">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Scale className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">No Scholarships Selected for Comparison</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You can select 2 to 4 scholarships by clicking the scale icon on any scholarship card to compare their eligibility criteria, benefits, and requirements side-by-side.
          </p>
        </div>
        <button
          onClick={onExploreMore}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          Explore Scholarships
        </button>
      </div>
    );
  }

  const rows = [
    { label: "Grant Amount", field: "amount_display", highlight: true },
    { 
      label: "Income Limit", 
      formatter: (s: ScholarshipRecord) => s.income_limit > 0 ? `≤ ₹${(s.income_limit / 100000).toFixed(1)} Lakh` : 'No Income Limit' 
    },
    { 
      label: "Minimum Marks", 
      formatter: (s: ScholarshipRecord) => `${s.minimum_marks}% (CGPA ${s.minimum_cgpa})` 
    },
    { label: "Provider Type", field: "provider_type" },
    { label: "Provider Organization", field: "provider" },
    { label: "State / Domicile", field: "state" },
    { label: "Education Level", field: "education_level" },
    { label: "Applicable Courses", field: "course" },
    { label: "Target Category", field: "category" },
    { label: "Gender Requirement", field: "gender" },
    { label: "Application Deadline", field: "application_end_date", highlight: true },
    { label: "Renewal Available", field: "renewal" },
    { label: "Key Benefits", field: "benefits" },
    { 
      label: "Required Documents", 
      formatter: (s: ScholarshipRecord) => (
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
          {(s.required_documents || []).slice(0, 4).map((doc, idx) => (
            <li key={idx} className="line-clamp-1">{doc}</li>
          ))}
        </ul>
      ) 
    }
  ];

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison Tool</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Comparing {scholarships.length} Selected Scholarships
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyze differences in grant amounts, academic thresholds, and documentation rules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {scholarships.length < 4 && (
            <button
              onClick={onExploreMore}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              + Add More (Up to 4)
            </button>
          )}

          <button
            onClick={onClear}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">
                Criteria
              </th>
              {scholarships.map((s) => (
                <th key={s.scholarship_id} className="p-4 text-left border-l border-slate-200 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <h2 
                      onClick={() => onViewDetails(s)}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {s.scholarship_name}
                    </h2>
                    <button
                      onClick={() => onRemove(s.scholarship_id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 shrink-0"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center space-x-2">
                    <a
                      href={s.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((row, idx) => (
              <tr key={idx} className={row.highlight ? "bg-blue-50/30" : "hover:bg-slate-50/50"}>
                <td className="p-4 font-semibold text-slate-700 whitespace-nowrap align-top">
                  {row.label}
                </td>
                {scholarships.map((s) => {
                  let val: any;
                  if (row.formatter) {
                    val = row.formatter(s);
                  } else if (row.field) {
                    val = (s as any)[row.field];
                  }

                  return (
                    <td key={s.scholarship_id} className="p-4 border-l border-slate-200 text-slate-700 align-top">
                      {row.highlight ? (
                        <span className="font-bold text-blue-900">{val}</span>
                      ) : (
                        val || "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
