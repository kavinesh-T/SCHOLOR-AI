import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  ChevronRight,
  ExternalLink,
  Cpu,
  MapPin,
  Building2,
  IndianRupee,
  BookOpen
} from 'lucide-react';
import { DashboardStats } from '../types';

interface HeroProps {
  onCheckEligibility: () => void;
  onExploreScholarships: () => void;
  onSelectCategory: (category: string) => void;
  stats: DashboardStats;
}

export const Hero: React.FC<HeroProps> = ({
  onCheckEligibility,
  onExploreScholarships,
  onSelectCategory,
  stats
}) => {
  const [heroSearchText, setHeroSearchText] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchText.trim()) {
      onSelectCategory(heroSearchText.trim());
    } else {
      onExploreScholarships();
    }
  };

  return (
    <div className="space-y-16 py-4 sm:py-8">
      
      {/* 1. HERO MAIN SECTION */}
      <section className="relative overflow-hidden rounded-3xl hero-mesh text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        
        {/* Subtle radial background glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Subtext, Live Search, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI-Powered Indian Scholarship Discovery Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Find Scholarships That Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">Your Future.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Pair your academic record, state domicile, caste category, and family income with <strong>516+ verified Indian scholarships</strong> across Central Government, State Portals, and top Corporate CSR initiatives.
            </p>

            {/* Live Search Bar in Hero */}
            <form onSubmit={handleHeroSearchSubmit} className="relative max-w-xl">
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all">
                <Search className="w-5 h-5 text-slate-300 ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearchText}
                  onChange={(e) => setHeroSearchText(e.target.value)}
                  placeholder="Search by course, state, category, or provider..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onCheckEligibility}
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Check My Eligibility (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreScholarships}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-300" />
                <span>Explore 516+ Schemes</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero registration fees</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Central & State portals</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100-Tree Random Forest inference</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Simulator Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl text-left space-y-4">
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Live ML Compatibility Match</h3>
                    <p className="text-[10px] text-slate-400">Priya Sharma • B.Tech CSE • Pune, MH</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  96% Match
                </span>
              </div>

              {/* Sample Card 1 */}
              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60 space-y-2 hover:border-blue-500/40 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-900">
                      Central Government (NSP)
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      AICTE Pragati Scholarship for Girls
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-400">₹50,000/yr</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/40">
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Meets 88.5% CGPA & Single Girl criteria</span>
                  </span>
                  <span className="text-amber-300 font-bold text-[10px]">32d left</span>
                </div>
              </div>

              {/* Sample Card 2 */}
              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60 space-y-2 hover:border-blue-500/40 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-purple-300 uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-900">
                      Corporate CSR
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                      Reliance Foundation Undergraduate Scholarship
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-400">Up to ₹2,00,000</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/40">
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Income ≤ ₹2.5L & STEM Merit Match</span>
                  </span>
                  <span className="text-red-400 font-bold text-[10px]">7d left</span>
                </div>
              </div>

              {/* Engine Status Bar */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px]">ML Engine: 516 Records Ready</span>
                </span>
                <button 
                  onClick={onCheckEligibility}
                  className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>Evaluate My Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. PLATFORM METRICS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all text-left">
          <div className="text-2xl sm:text-4xl font-black text-blue-800 tracking-tight">
            {stats.total_scholarships || 516}+
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Scholarship Records</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Central, State & CSR schemes verified</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all text-left">
          <div className="text-2xl sm:text-4xl font-black text-indigo-700 tracking-tight">
            100 Trees
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Random Forest Classifier</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Multi-factor eligibility vector scoring</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all text-left">
          <div className="text-2xl sm:text-4xl font-black text-emerald-700 tracking-tight">
            ₹9.6 Lakh
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Maximum Award Grant</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across premier higher ed fellowships</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all text-left">
          <div className="text-2xl sm:text-4xl font-black text-amber-600 tracking-tight">
            28 States
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Pan-India Coverage</div>
          <p className="text-[11px] text-slate-500 mt-0.5">MahaDBT, SSP, SVMCM, NSP & CSR</p>
        </div>
      </section>

      {/* 3. 4-STEP INTERACTIVE ROADMAP */}
      <section className="text-center space-y-10">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Methodical 4-Step Process</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ScholarMatch AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From entering your basic academic profile to applying with complete documents in 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-black text-base flex items-center justify-center border border-blue-200">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Create Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your education level, percentage/CGPA, annual family income, domicile state, and caste category in our 5-step wizard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 font-black text-base flex items-center justify-center border border-indigo-200">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Check Eligibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our 100-Tree Random Forest model executes deterministic constraint verification and qualification probability scoring.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 font-black text-base flex items-center justify-center border border-purple-200">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Personalized Matches</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a ranked list tailored specifically to your profile with clear match percentages and Explainable AI factors.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-black text-base flex items-center justify-center border border-emerald-200">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Apply With Confidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review required documents, track upcoming deadlines, compare schemes, and click through to official portals.
            </p>
          </div>

        </div>

        <div className="pt-2">
          <button
            onClick={onCheckEligibility}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Step 1: Create Profile</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. POPULAR CATEGORY CHIPS */}
      <section className="bg-slate-100/80 p-6 sm:p-8 rounded-3xl space-y-4 text-center border border-slate-200/80">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Explore Scholarships by Popular Demographics & Fields
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { label: "Engineering (B.Tech / B.E.)", query: "B.Tech" },
            { label: "Medical (MBBS / BDS / Nursing)", query: "MBBS" },
            { label: "Girls & Women in STEM", query: "Girls" },
            { label: "First-Generation Learners", query: "First Generation" },
            { label: "Low-Income (<= ₹2.5 Lakh)", query: "EBC" },
            { label: "SC / ST / OBC Affirmative Action", query: "Post-Matric" },
            { label: "Corporate CSR Initiatives", query: "CSR" },
            { label: "Minority Communities", query: "Minority" },
            { label: "State Government Schemes", query: "State Government" }
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSelectCategory(chip.query)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-800 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 transition-all shadow-2xs hover:border-blue-300 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* 5. TRUST & TRANSPARENCY CALLOUT */}
      <section className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-left flex items-start space-x-4">
        <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-amber-900">
            Trust, Verification & Direct Official Portal Redirection
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            ScholarMatch AI provides algorithmic eligibility matching and application assistance based on published Central, State, and Corporate CSR guidelines. We never collect application fees or disburse financial funds directly. Always verify criteria and submit applications on the official website link provided on each scholarship card.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Hero;
