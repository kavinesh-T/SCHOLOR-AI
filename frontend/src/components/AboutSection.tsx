import React from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Cpu, 
  HeartHandshake, 
  Sparkles, 
  FileCheck2, 
  Lock,
  ExternalLink
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 text-left">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-md">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-200 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          About ScholarMatch AI
        </h1>
        <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
          ScholarMatch AI was created to solve a pervasive problem across India: thousands of deserving school, college, and university students miss out on crores in scholarship grants simply because they do not know they qualify or get overwhelmed by scattered application portals.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Explainable AI Matching</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We don't use opaque black-box models. Every recommendation highlights the exact academic score, income ceiling, and domicile criteria that qualified you.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Equal Opportunity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated algorithms promote visibility for first-generation graduates, rural candidates, girl students in STEM, and marginalized communities.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Verified Direct Links</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every application link points directly to authentic government portals (NSP, State DBT portals) and verified corporate foundation programs.
          </p>
        </div>
      </div>

      {/* MANDATORY TRUST & TRANSPARENCY DISCLAIMER */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Trust &amp; Transparency Statement</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-amber-950">
          Official Disclaimer &amp; Student Responsibility
        </h2>
        <div className="text-xs text-amber-900 space-y-2 leading-relaxed">
          <p>
            ScholarMatch AI helps students discover scholarships using structured scholarship information and intelligent matching.
          </p>
          <p className="font-semibold">
            "ScholarMatch AI provides guidance and matching support. It does not guarantee scholarship selection."
          </p>
          <p>
            "Students should verify eligibility, deadlines, documents, and application instructions on the official scholarship website before applying."
          </p>
        </div>
      </div>

    </div>
  );
};
