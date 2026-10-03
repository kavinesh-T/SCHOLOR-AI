import React from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  Sparkles, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ScholarshipRecord, Scholarship } from '../types';

export interface ScholarshipCardProps {
  scholarship: ScholarshipRecord | Scholarship;
  onViewDetails?: (scholarship: ScholarshipRecord) => void;
  onToggleSave?: (scholarship: ScholarshipRecord) => void;
  isSaved?: boolean;
  onToggleCompare?: (scholarship: ScholarshipRecord) => void;
  isCompared?: boolean;

  // Optional legacy props
  onView?: () => void;
  saved?: boolean;
  onSave?: () => void;
  compact?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onViewDetails,
  onToggleSave,
  isSaved = false,
  onToggleCompare,
  isCompared = false,
  onView,
  saved,
  onSave,
  compact = false
}) => {
  const s = scholarship as any;
  const isBookmarked = saved !== undefined ? saved : isSaved;
  const title = s.scholarship_name || s.name || 'Scholarship Opportunity';
  const provider = s.provider || 'Scholarship Authority';
  const providerType = s.provider_type || s.scholarship_type || 'Government / CSR';
  const amountStr = s.amount_display || s.amount || (s.scholarship_amount ? `₹${s.scholarship_amount.toLocaleString('en-IN')}` : 'Financial Grant');
  const deadlineStr = s.application_end_date || s.deadline || 'Closing Soon';
  const matchScore = s.match_score !== undefined ? s.match_score : s.match_percentage;
  const reasons = s.reasons_eligible || s.match_reasons || [];
  const stateStr = s.state || 'All India';
  const officialLink = s.application_link || s.official_website || s.official_link || '#';

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(scholarship as ScholarshipRecord);
    } else if (onView) {
      onView();
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(scholarship as ScholarshipRecord);
    } else if (onSave) {
      onSave();
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(scholarship as ScholarshipRecord);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative overflow-hidden ${
        isCompared 
          ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
          : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
      } ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      {/* Top badges & action buttons */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              {providerType}
            </span>

            {s.category && (
              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-700">
                {s.category}
              </span>
            )}

            {matchScore !== undefined && matchScore > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1 ${
                matchScore >= 80 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : matchScore >= 60 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <Sparkles className="w-3 h-3" />
                <span>{matchScore}% Match</span>
              </span>
            )}
          </div>

          {/* Quick Bookmark and Compare Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            {onToggleCompare && (
              <button
                onClick={handleCompareClick}
                title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isCompared 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-slate-200'
                }`}
              >
                <Scale className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleSaveClick}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark scholarship'}
              className={`p-1.5 rounded-xl border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 border-slate-200'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scholarship Name & Provider */}
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{provider}</span>
          </p>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate">{amountStr}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{stateStr}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-500 col-span-2">
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] text-amber-800 font-medium">Deadline: {deadlineStr}</span>
            {s.days_left !== undefined && s.days_left <= 7 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 ml-auto">
                {s.days_left === 0 ? 'Today' : `${s.days_left}d left`}
              </span>
            )}
          </div>
        </div>

        {/* AI Match Reasons Preview (if available) */}
        {!compact && reasons.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-2.5 text-xs text-slate-600 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Key Eligibility Match</span>
            </div>
            <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
              {reasons[0]}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleCardClick}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {officialLink && officialLink !== '#' && (
          <a
            href={officialLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-colors shrink-0 shadow-2xs"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ScholarshipCard;
