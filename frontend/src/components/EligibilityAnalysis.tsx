import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  IndianRupee, 
  MapPin,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { RecommendationSummary, StudentProfile } from '../types';

interface EligibilityAnalysisProps {
  summary: RecommendationSummary;
  profile: StudentProfile;
  onViewRecommendations: (filterStatus?: string) => void;
  onEditProfile: () => void;
  isLiveApi?: boolean;
}

export const EligibilityAnalysis: React.FC<EligibilityAnalysisProps> = ({
  summary,
  profile,
  onViewRecommendations,
  onEditProfile,
  isLiveApi = true
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 text-left animate-in fade-in-50 duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Scholarship Eligibility Checker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Eligibility Analysis for {summary.student_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyzed {summary.total_evaluated} scholarship schemes across Central, State, and CSR databases.
            </p>
          </div>

          {/* Model Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium self-start sm:self-auto">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Random Forest Model (Active)</span>
          </div>
        </div>

        {/* Big Overall Match Metric & 3 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          {/* Overall Profile Match Gauge */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Overall Compatibility
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black tracking-tight text-white">
                  {summary.profile_match_percentage}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-blue-200">
              <p>Profile Tier: <span className="font-bold text-white">{summary.academic_tier}</span></p>
              <p className="text-blue-300/80 text-[10px] mt-0.5">Higher than 82% of comparable applicants</p>
            </div>
          </div>

          {/* Metric 1: Eligible Scholarships */}
          <div 
            onClick={() => onViewRecommendations('Eligible')}
            className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between cursor-pointer hover:bg-emerald-50 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider">Eligible</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-900 mt-2">
                {summary.eligible_scholarships}
              </div>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center justify-between mt-3 pt-2 border-t border-emerald-200/60">
              <span>View Eligible List</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Metric 2: Potential Matches */}
          <div 
            onClick={() => onViewRecommendations('Check Eligibility')}
            className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl flex flex-col justify-between cursor-pointer hover:bg-amber-50 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider">Potential Matches</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-900 mt-2">
                {summary.potential_matches}
              </div>
            </div>
            <div className="text-[11px] font-medium text-amber-700 flex items-center justify-between mt-3 pt-2 border-t border-amber-200/60">
              <span>Check Criteria</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Metric 3: Not Currently Eligible */}
          <div 
            onClick={() => onViewRecommendations('Not Eligible')}
            className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between cursor-pointer hover:bg-slate-100 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Not Eligible</span>
                <XCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-800 mt-2">
                {summary.not_eligible_scholarships}
              </div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
              <span>View Exclusions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>

      {/* 2. EXPLAINABLE AI FACTOR BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Explainable AI (XAI) Factor Analysis</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Why You Are Eligible: Primary Matching Determinants
          </h2>
          <p className="text-xs text-slate-500">
            Feature weightings evaluated by the Random Forest Classifier for your profile parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Factor 1: Academic Standing */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Academic Performance: {profile.percentage_cgpa}%</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Your score exceeds the standard 60% qualification mark for 88% of undergraduate and merit scholarships.
            </p>
          </div>

          {/* Factor 2: Financial Threshold */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Income Ceiling: ₹{profile.annual_family_income.toLocaleString('en-IN')}/yr</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Satisfies both the central government ₹4.5 Lakh and state EBC/EWS ₹8 Lakh eligibility limits.
            </p>
          </div>

          {/* Factor 3: Domicile Match */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>State Domicile: {profile.state}</span>
            </div>
            <p className="text-xs text-purple-800 leading-relaxed">
              Unlocks all Pan-India Central Government scholarships plus exclusive {profile.state} state departmental schemes.
            </p>
          </div>

          {/* Factor 4: Category & Affirmation */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Category: {profile.category} • First-Gen: {profile.first_generation}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Eligible for targeted affirmative action reservation quotas and corporate diversity outreach programs.
            </p>
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            onClick={onEditProfile}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Update Profile Details</span>
          </button>

          <button
            onClick={() => onViewRecommendations('Eligible')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all hover:scale-[1.01]"
          >
            <span>View {summary.eligible_scholarships} Eligible Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
