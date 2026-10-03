import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Search, 
  Bookmark, 
  Scale, 
  Clock, 
  User, 
  Menu, 
  X, 
  ShieldCheck,
  HelpCircle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenCheckEligibility: () => void;
  studentName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  savedCount,
  compareCount,
  onOpenCheckEligibility,
  studentName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'scholarships', label: 'Directory', icon: Search },
    { id: 'eligibility', label: 'AI Checker', icon: Sparkles, badge: 'ML' },
    { id: 'compare', label: 'Compare', icon: Scale, count: compareCount },
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'dashboard', label: 'Student Dashboard', icon: User },
    { id: 'how-it-works', label: 'Methodology', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/15 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5.5 h-5.5 text-white" />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-0.5 shadow-xs border-2 border-white">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 bg-clip-text text-transparent">
                  ScholarMatch
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Scholarship Eligibility & Recommendation
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-800 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                  
                  {link.badge && (
                    <span className="text-[9px] uppercase font-black px-1.5 py-0.2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Compare Counter Badge */}
            <button
              onClick={() => handleTabClick('compare')}
              className={`p-2 rounded-xl relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                currentTab === 'compare' ? 'bg-blue-50 text-blue-700' : ''
              }`}
              title="Compare Scholarships"
            >
              <Scale className="w-4.5 h-4.5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Saved Bookmarks */}
            <button
              onClick={() => handleTabClick('saved')}
              className={`p-2 rounded-xl relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                currentTab === 'saved' ? 'bg-amber-50 text-amber-700' : ''
              }`}
              title="Saved Scholarships"
            >
              <Bookmark className="w-4.5 h-4.5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => handleTabClick('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 border border-slate-200 ${
                currentTab === 'admin' ? 'bg-slate-900 text-white border-slate-900' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenCheckEligibility}
              className="bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/15 hover:shadow-lg transition-all flex items-center space-x-1.5 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Check Eligibility</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => handleTabClick('saved')}
              className="p-2 rounded-lg text-slate-600 relative hover:bg-slate-100"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-2 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider">Navigation Menu</span>
            {studentName && (
              <span className="text-blue-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{studentName}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                    isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenCheckEligibility();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold text-xs py-3 rounded-xl shadow-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Check My Eligibility</span>
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className="w-full text-center text-xs font-semibold text-slate-600 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Admin Scholarship Management Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
