import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Building2,
  Search
} from 'lucide-react';
import { ScholarshipRecord } from '../types';

interface SavedScholarshipsProps {
  scholarships: ScholarshipRecord[];
  onRemove: (scholarshipId: string) => void;
  onViewDetails: (scholarship: ScholarshipRecord) => void;
  onExploreMore: () => void;
}

export const SavedScholarships: React.FC<SavedScholarshipsProps> = ({
  scholarships,
  onRemove,
  onViewDetails,
  onExploreMore
}) => {
  if (scholarships.length === 0) {
    return (
      <div className="py-20 px-6 text-center space-y-4 bg-white rounded-3xl border border-slate-200 max-w-2xl mx-auto my-6 shadow-xs">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Bookmark className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">No Saved Scholarships</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No scholarships saved yet. Explore recommendations and bookmark the ones you like to track deadlines and application materials.
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

  return (
    <div className="space-y-6 py-6 text-left max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Bookmarks</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            My Saved Scholarships ({scholarships.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of your bookmarked schemes and monitor upcoming deadline closing dates.
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Find More Scholarships</span>
        </button>
      </div>

      {/* Saved Cards List */}
      <div className="space-y-3">
        {scholarships.map((s) => (
          <div 
            key={s.scholarship_id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {s.provider_type}
                </span>
                {s.match_score && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{s.match_score}% Match</span>
                  </span>
                )}
                <span className="text-xs font-bold text-blue-900">
                  {s.amount_display}
                </span>
              </div>

              <h2 
                onClick={() => onViewDetails(s)}
                className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {s.scholarship_name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.provider}</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-700 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {s.application_end_date}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => onViewDetails(s)}
                className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors text-center"
              >
                View Details
              </button>

              <a
                href={s.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>Apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onRemove(s.scholarship_id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
