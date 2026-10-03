import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Search, 
  Scale, 
  Bookmark, 
  Clock, 
  User, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

import { StudentProfile, ScholarshipRecord, RecommendationSummary, DashboardStats } from './types';
import { SAMPLE_PROFILES } from './data/constants';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileWizard } from './components/ProfileWizard';
import { EligibilityAnalysis } from './components/EligibilityAnalysis';
import { ScholarshipSearch } from './components/ScholarshipSearch';
import { ScholarshipDetailsModal } from './components/ScholarshipDetailsModal';
import { ScholarshipComparison } from './components/ScholarshipComparison';
import { SavedScholarships } from './components/SavedScholarships';
import { DeadlineDashboard } from './components/DeadlineDashboard';
import { PersonalizedDashboard } from './components/PersonalizedDashboard';
import { DocumentChecklist } from './components/DocumentChecklist';
import { AdminDashboard } from './components/AdminDashboard';
import { FAQSection } from './components/FAQSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ScholarshipCard } from './components/ScholarshipCard';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [initialCategoryQuery, setInitialCategoryQuery] = useState<string>('');

  // Student Profile (initialized with Priya Sharma as default demo)
  const [profile, setProfile] = useState<StudentProfile>(SAMPLE_PROFILES[0].profile);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Recommendations & Eligibility
  const [summary, setSummary] = useState<RecommendationSummary | null>(null);
  const [recommendations, setRecommendations] = useState<ScholarshipRecord[]>([]);
  const [recommendationFilter, setRecommendationFilter] = useState<string>('All');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Saved Bookmarks & Comparison List
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('scholarmatch_saved');
      return stored ? JSON.parse(stored) : ['SCH-001', 'SCH-002'];
    } catch {
      return ['SCH-001', 'SCH-002'];
    }
  });

  const [comparedIds, setComparedIds] = useState<string[]>(['SCH-001', 'SCH-002']);

  // Modal Detail View
  const [activeModalScholarship, setActiveModalScholarship] = useState<ScholarshipRecord | null>(null);

  // System Stats & API Health
  const [stats, setStats] = useState<DashboardStats>({
    total_scholarships: 516,
    active_scholarships: 488,
    closing_soon_count: 28,
    central_gov_count: 72,
    state_gov_count: 294,
    private_csr_count: 150,
    avg_scholarship_amount: 58500,
    max_scholarship_amount: 960000
  });
  const [isLiveApi, setIsLiveApi] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run initial health check & run initial evaluation for default student
  useEffect(() => {
    const initApp = async () => {
      try {
        const health = await api.getHealth();
        setIsLiveApi(health.ml_trained);
        const statsData = await api.getStats();
        setStats(statsData);
        // Run recommendations for initial profile
        runEligibilityEvaluation(profile, false);
      } catch (err) {
        console.error('App init error:', err);
      }
    };
    initApp();
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scholarmatch_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [savedIds]);

  const runEligibilityEvaluation = async (prof: StudentProfile, triggerConfetti: boolean = true) => {
    setIsEvaluating(true);
    try {
      const res = await api.getRecommendations(prof);
      setSummary(res.summary);
      setRecommendations(res.recommendations);

      if (triggerConfetti) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast(`Eligibility evaluated! Found ${res.summary.eligible_scholarships} matching scholarships.`);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
      showToast('Evaluation failed to connect to ML backend.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleProfileWizardSubmit = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setIsWizardOpen(false);
    runEligibilityEvaluation(newProfile, true);
    setCurrentTab('eligibility');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (sch: ScholarshipRecord) => {
    setSavedIds(prev => {
      const exists = prev.includes(sch.scholarship_id);
      if (exists) {
        showToast(`Removed "${sch.scholarship_name}" from saved list.`);
        return prev.filter(id => id !== sch.scholarship_id);
      } else {
        showToast(`Saved "${sch.scholarship_name}" to your bookmarks!`);
        return [...prev, sch.scholarship_id];
      }
    });
  };

  const handleToggleCompare = (sch: ScholarshipRecord) => {
    setComparedIds(prev => {
      const exists = prev.includes(sch.scholarship_id);
      if (exists) {
        showToast(`Removed from comparison.`);
        return prev.filter(id => id !== sch.scholarship_id);
      } else {
        if (prev.length >= 4) {
          showToast(`Maximum 4 scholarships can be compared simultaneously.`);
          return prev;
        }
        showToast(`Added "${sch.scholarship_name}" to comparison.`);
        return [...prev, sch.scholarship_id];
      }
    });
  };

  const handleSelectCategoryFromHero = (query: string) => {
    setInitialCategoryQuery(query);
    setCurrentTab('scholarships');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get saved scholarships objects from recommendations or fetch
  const savedScholarshipsList = recommendations.filter(s => savedIds.includes(s.scholarship_id));
  const comparedScholarshipsList = recommendations.filter(s => comparedIds.includes(s.scholarship_id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={savedIds.length}
        compareCount={comparedIds.length}
        onOpenCheckEligibility={() => {
          setIsWizardOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        studentName={profile.name}
      />

      {/* Live ML Backend Indicator Pill */}
      <div className="bg-slate-100/90 border-b border-slate-200 py-1 px-4 text-center text-[11px] text-slate-700 flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-900">AI ML System Active:</span>
        <span>100-Tree Random Forest Classifier Connected</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">516 Indian Scholarship Records Loaded</span>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* MODAL PROFILE WIZARD (When triggered from top CTA) */}
        {isWizardOpen && (
          <div className="mb-8">
            <ProfileWizard
              initialProfile={profile}
              onSubmit={handleProfileWizardSubmit}
              onCancel={() => setIsWizardOpen(false)}
            />
          </div>
        )}

        {/* 1. HOME TAB (LANDING PAGE) */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            <Hero
              onCheckEligibility={() => {
                setIsWizardOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreScholarships={() => setCurrentTab('scholarships')}
              onSelectCategory={handleSelectCategoryFromHero}
              stats={stats}
            />

            {/* Quick Preview of Recommendations if profile evaluated */}
            {summary && recommendations.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-left space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Live Recommendations for {profile.name}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Top Matched Opportunities ({summary.profile_match_percentage}% Profile Match)
                    </h2>
                  </div>

                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>View Student Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.slice(0, 3).map((sch) => (
                    <div key={sch.scholarship_id} className="h-full">
                      <div className="h-full">
                        <ScholarshipCard
                          scholarship={sch}
                          onViewDetails={setActiveModalScholarship}
                          onToggleSave={handleToggleSave}
                          isSaved={savedIds.includes(sch.scholarship_id)}
                          onToggleCompare={handleToggleCompare}
                          isCompared={comparedIds.includes(sch.scholarship_id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Preview */}
            <FAQSection />
          </div>
        )}

        {/* 2. SCHOLARSHIPS DIRECTORY & SEARCH TAB */}
        {currentTab === 'scholarships' && (
          <ScholarshipSearch
            onViewDetails={setActiveModalScholarship}
            onToggleSave={handleToggleSave}
            savedIds={savedIds}
            onToggleCompare={handleToggleCompare}
            comparedIds={comparedIds}
            initialCategoryQuery={initialCategoryQuery}
          />
        )}

        {/* 3. AI ELIGIBILITY CHECKER & ANALYSIS TAB */}
        {currentTab === 'eligibility' && (
          <div className="space-y-8">
            {summary ? (
              <EligibilityAnalysis
                summary={summary}
                profile={profile}
                onViewRecommendations={(status) => {
                  setRecommendationFilter(status || 'All');
                  setCurrentTab('dashboard');
                }}
                onEditProfile={() => {
                  setIsWizardOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isLiveApi={isLiveApi}
              />
            ) : (
              <ProfileWizard
                initialProfile={profile}
                onSubmit={handleProfileWizardSubmit}
              />
            )}
          </div>
        )}

        {/* 4. SCHOLARSHIP COMPARISON TAB */}
        {currentTab === 'compare' && (
          <ScholarshipComparison
            scholarships={comparedScholarshipsList}
            onRemove={(id) => setComparedIds(prev => prev.filter(x => x !== id))}
            onClear={() => setComparedIds([])}
            onViewDetails={setActiveModalScholarship}
            onExploreMore={() => setCurrentTab('scholarships')}
          />
        )}

        {/* 5. SAVED SCHOLARSHIPS TAB */}
        {currentTab === 'saved' && (
          <SavedScholarships
            scholarships={savedScholarshipsList}
            onRemove={(id) => setSavedIds(prev => prev.filter(x => x !== id))}
            onViewDetails={setActiveModalScholarship}
            onExploreMore={() => setCurrentTab('scholarships')}
          />
        )}

        {/* 6. DEADLINES CALENDAR TAB */}
        {currentTab === 'deadlines' && (
          <DeadlineDashboard
            onViewDetails={setActiveModalScholarship}
            onExploreMore={() => setCurrentTab('scholarships')}
          />
        )}

        {/* 7. PERSONALIZED STUDENT DASHBOARD TAB */}
        {currentTab === 'dashboard' && (
          <PersonalizedDashboard
            profile={profile}
            summary={summary}
            recommendedScholarships={
              recommendationFilter === 'Eligible'
                ? recommendations.filter(s => s.eligibility_status === 'Eligible')
                : recommendationFilter === 'Check Eligibility'
                ? recommendations.filter(s => s.eligibility_status === 'Check Eligibility')
                : recommendations
            }
            savedScholarships={savedScholarshipsList}
            onViewDetails={setActiveModalScholarship}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onEditProfile={() => {
              setIsWizardOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAllRecommendations={() => setCurrentTab('scholarships')}
            onOpenDocumentChecklist={() => setCurrentTab('checklist')}
          />
        )}

        {/* 8. DOCUMENT CHECKLIST TAB */}
        {currentTab === 'checklist' && (
          <DocumentChecklist />
        )}

        {/* 9. HOW IT WORKS TAB */}
        {currentTab === 'how-it-works' && (
          <div className="max-w-4xl mx-auto py-10 space-y-10 text-left">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Intelligent Methodology</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                How ScholarMatch AI Analyzes Your Eligibility
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Discover the engineering and data science behind our scholarship matching system.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Multi-Dimensional Profile Ingestion</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We collect your exact academic standing (percentage and CGPA), family income slab, institution type, caste/reservation category, and affirmative action status (first-generation graduate, single girl child, rural location).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Deterministic Hard-Constraint Verification</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The engine checks non-negotiable legal and portal rules: domicile requirements (e.g. Maharashtra MahaDBT requires Maharashtra domicile), category reservations, and hard income caps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Random Forest Classifier Inference (100 Trees)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A machine learning model trained with 100 decision trees and maximum depth of 10 assesses qualification probability, ranking your application competitiveness against similar applicants nationwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Explainable AI Reason Synthesis</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every result is annotated with transparent factors telling you exactly why you qualify (e.g., "Score is 26% above the 60% requirement; income is within ₹4.5L limit").
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setIsWizardOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
              >
                Test Your Profile Now →
              </button>
            </div>
          </div>
        )}

        {/* 10. ABOUT US TAB */}
        {currentTab === 'about' && (
          <AboutSection />
        )}

        {/* 11. FAQ TAB */}
        {currentTab === 'faq' && (
          <FAQSection />
        )}

        {/* 12. ADMIN PORTAL TAB */}
        {currentTab === 'admin' && (
          <AdminDashboard onBackToApp={() => setCurrentTab('home')} />
        )}

      </main>

      {/* SCHOLARSHIP DETAILS MODAL */}
      <ScholarshipDetailsModal
        scholarship={activeModalScholarship}
        onClose={() => setActiveModalScholarship(null)}
        onToggleSave={handleToggleSave}
        isSaved={activeModalScholarship ? savedIds.includes(activeModalScholarship.scholarship_id) : false}
        onToggleCompare={handleToggleCompare}
        isCompared={activeModalScholarship ? comparedIds.includes(activeModalScholarship.scholarship_id) : false}
        profile={profile}
      />

      {/* FOOTER */}
      <Footer onNavigate={setCurrentTab} />

    </div>
  );
};

export default App;
