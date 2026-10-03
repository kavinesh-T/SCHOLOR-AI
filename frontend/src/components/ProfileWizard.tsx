import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  BookOpen, 
  IndianRupee, 
  CheckSquare, 
  ArrowRight,
  RotateCcw,
  Zap
} from 'lucide-react';
import { StudentProfile } from '../types';
import { 
  INDIAN_STATES, 
  COURSES, 
  EDUCATION_LEVELS, 
  CATEGORIES, 
  INSTITUTION_TYPES, 
  PARENT_EMPLOYMENTS,
  SAMPLE_PROFILES
} from '../data/constants';

interface ProfileWizardProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  initialProfile,
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const updateField = (field: keyof StudentProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickPreFill = (sample: StudentProfile) => {
    setProfile(sample);
  };

  const stepsList = [
    { num: 1, title: 'Basic Information', icon: User },
    { num: 2, title: 'Academic Information', icon: BookOpen },
    { num: 3, title: 'Financial Information', icon: IndianRupee },
    { num: 4, title: 'Special Criteria', icon: CheckSquare },
    { num: 5, title: 'Review & Verify', icon: Sparkles }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 text-left">
      
      {/* Top Card & Quick Fill Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header with Title and Quick Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Intelligent Student Profiler</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Create Your Scholarship Profile
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 5 — {stepsList[step - 1].title}
            </p>
          </div>

          {/* Quick Demo Pre-fill Selector */}
          <div className="bg-blue-50/80 border border-blue-200/80 p-2.5 rounded-2xl flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-blue-900 shrink-0">Quick Pre-fill:</span>
            <select
              onChange={(e) => {
                const found = SAMPLE_PROFILES.find(p => p.profile.name === e.target.value);
                if (found) handleQuickPreFill(found.profile);
              }}
              className="text-xs bg-white text-slate-800 rounded-lg px-2.5 py-1.5 border border-blue-200 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={profile.name}
            >
              {SAMPLE_PROFILES.map(s => (
                <option key={s.profile.name} value={s.profile.name}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-step Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500">
            {stepsList.map(s => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center space-x-1 transition-colors ${
                  step === s.num ? 'text-blue-600 font-bold' : step > s.num ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num 
                    ? 'bg-blue-600 text-white' 
                    : step > s.num 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden md:inline">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* FORM CONTENT BY STEP */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          
          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={50}
                    required
                    value={profile.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Social / Caste Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'cat' ? null : 'cat')}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'cat' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                      Select OBC if belonging to Non-Creamy Layer (NCL). Select EWS if family is in Economically Weaker Section with annual income &lt; ₹8L.
                    </div>
                  )}
                  <select
                    value={profile.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Domicile State (Permanent Residence) *
                  </label>
                  <select
                    value={profile.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {INDIAN_STATES.filter(s => s !== "All India").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    placeholder="e.g. Pune, Jaipur, Lucknow"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC INFORMATION */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Education Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Education Level *
                  </label>
                  <select
                    value={profile.education_level}
                    onChange={(e) => updateField('education_level', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {EDUCATION_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Course Enrolled *
                  </label>
                  <select
                    value={profile.course}
                    onChange={(e) => updateField('course', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {COURSES.map(crs => (
                      <option key={crs} value={crs}>{crs}</option>
                    ))}
                  </select>
                </div>

                {/* Specialization / Branch */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specialization / Branch
                  </label>
                  <input
                    type="text"
                    value={profile.specialization}
                    onChange={(e) => updateField('specialization', e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical, PCB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Current Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Year of Study *
                  </label>
                  <select
                    value={profile.current_year}
                    onChange={(e) => updateField('current_year', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                {/* Institution Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / College Type *
                  </label>
                  <select
                    value={profile.institution_type}
                    onChange={(e) => updateField('institution_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {INSTITUTION_TYPES.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                {/* Current Percentage / CGPA */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Marks / Percentage (%) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'cgpa' ? null : 'cgpa')}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'cgpa' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                      If your college uses a 10-point CGPA scale, multiply CGPA by 9.5 (e.g. 8.6 CGPA = 81.7%).
                    </div>
                  )}
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    required
                    value={profile.percentage_cgpa}
                    onChange={(e) => updateField('percentage_cgpa', parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 86.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                {/* Previous Academic Performance */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Previous Qualifying Exam Marks (%) * (10th / 12th Board)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    required
                    value={profile.previous_marks}
                    onChange={(e) => updateField('previous_marks', parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL INFORMATION */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Annual Family Income */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Total Annual Family Income (INR ₹) *
                    </label>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹{profile.annual_family_income.toLocaleString('en-IN')} / year
                    </span>
                  </div>
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    max="5000000"
                    required
                    value={profile.annual_family_income}
                    onChange={(e) => updateField('annual_family_income', parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span>Below ₹2.5 Lakh = BPL / High Need</span>
                    <span>₹2.5L to ₹8 Lakh = EBC / Creamy Layer Threshold</span>
                  </div>
                </div>

                {/* Income Certificate Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Income Certificate Availability *
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'inc' ? null : 'inc')}
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'inc' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800">
                      Must be issued by Tehsildar, Revenue Officer, or SDO. Valid for the current financial year.
                    </div>
                  )}
                  <select
                    value={profile.income_certificate}
                    onChange={(e) => updateField('income_certificate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="Available">Available (Already have certificate)</option>
                    <option value="Applied">Applied (In progress)</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                {/* Parent / Guardian Employment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent / Guardian Occupation *
                  </label>
                  <select
                    value={profile.parent_employment}
                    onChange={(e) => updateField('parent_employment', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {PARENT_EMPLOYMENTS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: SPECIAL ELIGIBILITY CRITERIA */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <p className="text-xs text-slate-500">
                These criteria help match you with exclusive affirmative action and diversity scholarships in India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Disability Status */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Person with Disability (PwD)</span>
                    <select
                      value={profile.disability_status}
                      onChange={(e) => updateField('disability_status', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="No">No</option>
                      <option value="Yes (PwD >= 40%)">Yes (PwD &gt;= 40%)</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Unlocks AICTE Saksham and dedicated PwD grants.</span>
                </div>

                {/* First Generation Learner */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">First Generation College Graduate</span>
                    <select
                      value={profile.first_generation}
                      onChange={(e) => updateField('first_generation', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">First in family to pursue a college degree.</span>
                </div>

                {/* Single Girl Child */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Single Girl Child in Family</span>
                    <select
                      value={profile.single_girl_child}
                      onChange={(e) => updateField('single_girl_child', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Eligible for UGC Indira Gandhi Single Girl Child scheme.</span>
                </div>

                {/* Residence Type */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Residence Type</span>
                    <select
                      value={profile.residence_type}
                      onChange={(e) => updateField('residence_type', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="Hosteler">Hosteler (Staying in hostel)</option>
                      <option value="Day Scholar">Day Scholar (Commuting from home)</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Hostelers receive higher maintenance allowances.</span>
                </div>

                {/* Rural Background */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Hails from Rural / Backward Area</span>
                    <select
                      value={profile.rural_area}
                      onChange={(e) => updateField('rural_area', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Grants rural upliftment scholarship preferences.</span>
                </div>

                {/* Existing Scholarship */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Already Receiving Any Scholarship?</span>
                    <select
                      value={profile.scholarship_already_received}
                      onChange={(e) => updateField('scholarship_already_received', e.target.value)}
                      className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white font-medium"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Prevents duplicate government benefit disqualification.</span>
                </div>

              </div>
            </div>
          )}

          {/* STEP 5: PROFILE REVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-800">
                  Profile configured! Review your details below. You can click on any section to make edits before running the AI eligibility analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Summary Box 1: Personal */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Basic Details</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[11px] text-blue-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Name:</span> {profile.name} ({profile.age} yrs, {profile.gender})</p>
                    <p><span className="font-medium text-slate-700">Domicile:</span> {profile.district}, {profile.state}</p>
                    <p><span className="font-medium text-slate-700">Category:</span> {profile.category}</p>
                  </div>
                </div>

                {/* Summary Box 2: Academic */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Academic Standing</span>
                    <button type="button" onClick={() => setStep(2)} className="text-[11px] text-blue-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Course:</span> {profile.course} ({profile.current_year})</p>
                    <p><span className="font-medium text-slate-700">Level:</span> {profile.education_level}</p>
                    <p><span className="font-medium text-slate-700">Marks:</span> {profile.percentage_cgpa}% (Prev: {profile.previous_marks}%)</p>
                  </div>
                </div>

                {/* Summary Box 3: Financial */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Financial Profile</span>
                    <button type="button" onClick={() => setStep(3)} className="text-[11px] text-blue-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">Annual Income:</span> ₹{profile.annual_family_income.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium text-slate-700">Income Certificate:</span> {profile.income_certificate}</p>
                    <p><span className="font-medium text-slate-700">Parent Occupation:</span> {profile.parent_employment}</p>
                  </div>
                </div>

                {/* Summary Box 4: Special Status */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Special Criteria</span>
                    <button type="button" onClick={() => setStep(4)} className="text-[11px] text-blue-600 font-semibold hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-700">First-Gen Graduate:</span> {profile.first_generation}</p>
                    <p><span className="font-medium text-slate-700">PwD Status:</span> {profile.disability_status}</p>
                    <p><span className="font-medium text-slate-700">Residence:</span> {profile.residence_type}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center space-x-2 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
