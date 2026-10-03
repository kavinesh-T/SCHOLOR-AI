import React from 'react';
import { GraduationCap, Sparkles, Heart, ShieldCheck, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">ScholarMatch AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Helping students discover opportunities. Smart scholarship eligibility matching &amp; recommendation platform for Indian students.
            </p>
            <p className="text-[11px] text-slate-500">
              "Your Profile. Your Eligibility. Your Opportunities."
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scholarships')} className="hover:text-white transition-colors">
                  Explore Scholarships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('eligibility')} className="hover:text-white transition-colors">
                  AI Eligibility Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('deadlines')} className="hover:text-white transition-colors">
                  Deadlines Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Student Resources</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('checklist')} className="hover:text-white transition-colors">
                  Application Document Checklist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition-colors">
                  Scholarship Comparison Tool
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <a 
                  href="https://scholarships.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  National Scholarship Portal (NSP)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trust &amp; Legal</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              ScholarMatch AI provides educational guidance. We are not affiliated with any single government department. Please verify deadlines with official portals.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free Public Student Service</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 ScholarMatch AI. Built for student empowerment across India.</p>
          <div className="flex items-center space-x-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Disclaimers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
