import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is ScholarMatch AI?",
      answer: "ScholarMatch AI is an intelligent scholarship discovery and eligibility recommendation platform built specifically for students in India. It pairs your academic achievements, domicile state, social category, and family income with over 500+ verified Central, State, and Corporate scholarships using a 100-tree Random Forest machine learning model."
    },
    {
      question: "How does the eligibility checker work?",
      answer: "When you complete your student profile wizard, the system analyzes both hard criteria (such as state domicile constraints, gender, and income ceiling) and soft machine learning features (academic percentage margins, first-generation learner status, and document readiness) to calculate a calibrated match score between 0% and 100%."
    },
    {
      question: "How are scholarships recommended?",
      answer: "Recommendations are ranked using a hybrid scoring algorithm that blends Random Forest probability predictions with rule-based verification. Scholarships where you satisfy all qualifications appear under 'Eligible', while borderline or documentation-dependent schemes appear under 'Check Eligibility'."
    },
    {
      question: "Can I trust the eligibility result?",
      answer: "Yes, our engine evaluates actual eligibility criteria published in official government scheme guidelines and corporate CSR mandates. However, ScholarMatch AI provides matching guidance and cannot guarantee final scholarship award, which is strictly decided by the issuing government department or foundation."
    },
    {
      question: "Are all scholarships available across India?",
      answer: "No. Central Government schemes (like NSP Central Sector, AICTE Pragati, PMRF) are Pan-India, while State Government schemes (like Maharashtra MahaDBT, Karnataka SSP, West Bengal SVMCM) require permanent domicile in their respective state. Our algorithm automatically filters out state schemes you do not qualify for."
    },
    {
      question: "How do I apply for a scholarship?",
      answer: "Each scholarship card and details modal includes a direct link labeled 'Apply on Official Website'. Clicking it will safely take you to the official government portal (such as scholarships.gov.in, state portals, or authorized corporate platforms like Buddy4Study)."
    },
    {
      question: "Can I save scholarships to apply later?",
      answer: "Yes! Click the bookmark icon on any scholarship card to add it to 'My Saved Scholarships'. You can track closing deadlines and review your shortlisted opportunities at any time from the top navigation bar."
    },
    {
      question: "How often is scholarship information updated?",
      answer: "Our scholarship database is continuously updated and verified. Administrators review application start dates, closing deadlines, and revised income criteria at the beginning of every academic admission cycle."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6 text-left">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Clear answers about eligibility verification, machine learning predictions, and applying.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-slate-50/70"
              >
                <span className="text-sm font-bold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed animate-in fade-in-50 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
