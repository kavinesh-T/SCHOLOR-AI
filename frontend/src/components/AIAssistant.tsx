import { useState } from 'react';
import { MessageSquare, Send, Sparkles, BookOpen, HelpCircle, ChevronRight } from 'lucide-react';
import { Spinner } from './ui/SharedUI';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'What scholarships are available for SC students in Engineering?',
  'How do I apply for NSP scholarships?',
  'What documents are needed for INSPIRE scholarship?',
  'Are there scholarships for girls in STEM?',
  'What is the income limit for most need-based scholarships?',
  'How does ScholarMatch AI calculate my match score?',
  'Which scholarships have the highest award amount?',
  'Can I apply to multiple scholarships simultaneously?',
];

const AI_RESPONSES: Record<string, string> = {
  default: `I'm ScholarMatch AI Assistant. I can help you understand scholarship eligibility, application processes, required documents, and how to navigate the platform.\n\nAsk me anything about scholarships in India!`,
  sc: `For SC students in Engineering, here are key scholarships:\n\n• **NSP Post-Matric Scholarship for SC** — ₹23,400/yr, income ≤₹2.5L, by Ministry of Social Justice\n• **Dr. Ambedkar Post-Matric Scholarship** — Various state governments offer this\n• **PMSS (PM Scholarship Scheme)** — For families of ex-servicemen/police\n• **State SC Scholarships** — Check your state government portal\n\n💡 Use "Explore" and filter by Category: SC/ST to see all matching scholarships in our database.`,
  nsp: `**Applying for NSP (National Scholarship Portal) Scholarships:**\n\n1. Visit scholarships.gov.in\n2. Register as a student with Aadhaar number\n3. Select your scholarship scheme\n4. Fill in academic and personal details\n5. Upload required documents (marksheet, income certificate, caste certificate)\n6. Submit and track on the portal\n\n⚠️ Always apply before the official deadline. NSP deadlines are typically October-November each year.`,
  inspire: `**Documents needed for INSPIRE Scholarship:**\n\n✅ Required:\n• Class 12 Marksheet (must be in top 1% of board)\n• Enrollment letter from current institution\n• Bank account details (student's own)\n• Aadhaar card\n• Passport photo\n• Institution certificate confirming enrollment in B.Sc/Integrated M.Sc\n\n📋 Apply at: online-inspire.gov.in\n💰 Award: ₹80,000/year for 5 years\n🎯 Eligibility: Top 1% in Class 12, pursuing Natural/Basic Sciences`,
  girls: `**Scholarships specifically for Girls/Women in STEM:**\n\n• **AICTE Pragati Scholarship** — ₹50,000/yr for girl students in technical education\n• **Vigyan Jyoti Program** — DBT program for girls in science\n• **Google Generation Scholarship** — For women in CS/tech\n• **ISRO Scholarship** — For girls in space science\n• **HDFC Bank Ed-Crisis Scholarship** — Available to women facing financial difficulties\n\nFilter by "Gender: Female" in our Explore section to see all girl-specific scholarships.`,
  income: `**Income limits for need-based scholarships (typical ranges):**\n\n| Scholarship Type | Income Limit |\n|-----------------|-------------|\n| Central Govt (SC/ST) | ≤ ₹2.5 lakh/year |\n| Central Govt (General) | ≤ ₹4.5 lakh/year |\n| State Merit Scholarships | ≤ ₹6–8 lakh/year |\n| CSR/Private | ≤ ₹5–8 lakh/year |\n| Minority Scholarships | ≤ ₹2 lakh/year |\n\n💡 Always check the official notification — limits change annually.`,
  match: `**How ScholarMatch AI calculates your match score:**\n\nWe use a Random Forest classifier trained on 12 eligibility features:\n\n1. **Academic Performance** (your %, board average)\n2. **Income Match** (family income vs. scholarship limit)\n3. **Category Eligibility** (SC/ST/OBC/General/Minority)\n4. **State Coverage** (scholarship available in your state)\n5. **Gender Match** (some scholarships are gender-specific)\n6. **Education Level** (10th/12th/UG/PG)\n7. **Course Alignment** (your stream vs. scholarship requirements)\n8. **First-Gen Learner Bonus** (some scholarships prioritize this)\n9. **PWD Status** (disability-specific scholarships)\n10. **Rural Bonus** (rural students get priority in some schemes)\n\nScores: 90-100% = Excellent | 80-89% = Strong | 70-79% = Potential | <70% = Low Match`,
};

function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('sc') || q.includes('scheduled') || q.includes('dalit')) return AI_RESPONSES.sc;
  if (q.includes('nsp') || q.includes('national scholarship portal') || q.includes('apply')) return AI_RESPONSES.nsp;
  if (q.includes('inspire') || q.includes('document')) return AI_RESPONSES.inspire;
  if (q.includes('girl') || q.includes('women') || q.includes('female') || q.includes('stem')) return AI_RESPONSES.girls;
  if (q.includes('income') || q.includes('limit') || q.includes('need-based')) return AI_RESPONSES.income;
  if (q.includes('match') || q.includes('score') || q.includes('calculate') || q.includes('how does')) return AI_RESPONSES.match;
  return `Thank you for your question! 

Based on our scholarship database, here's what I can tell you:

ScholarMatch AI tracks 516+ scholarships across all categories — Merit, Need-based, SC/ST/OBC, Minority, Women, PWD, Sports, and more.

For the most accurate information, I recommend:
1. Complete your profile for personalized matches
2. Use the Explore section to filter scholarships
3. Visit official scholarship websites for current details

Is there a specific scholarship or category you'd like to know more about?`;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: AI_RESPONSES.default, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(text);
      setMessages(m => [...m, { role: 'ai', text: aiResponse, timestamp: new Date() }]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px' }}>
      {/* Header card */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '1px solid #c4b5fd' }}>
        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#3b0764' }}>AI Scholarship Assistant</div>
          <div style={{ fontSize: '0.8rem', color: '#6d28d9', marginTop: '0.2rem' }}>Ask me anything about scholarships, eligibility, documents, or application processes.</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-violet">
            <span className="status-dot status-online" style={{ width: '5px', height: '5px' }} /> Online
          </span>
        </div>
      </div>

      {/* Suggested Questions */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <HelpCircle size={13} /> Suggested Questions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', borderRadius: '9999px' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Messages */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.25rem' }}>
              {msg.role === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={10} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>ScholarMatch AI</span>
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={10} color="#fff" />
              </div>
              <div className="chat-bubble-ai" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.75rem' }}>
                {[0,1,2].map(j => (
                  <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', animation: `bounce 1.2s ${j * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-default)', display: 'flex', gap: '0.625rem' }}>
          <input
            className="form-input"
            placeholder="Ask about scholarships, eligibility, documents..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{ padding: '0 1rem', borderRadius: '0.625rem' }}
          >
            {loading ? <Spinner size={16} color="#fff" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <BookOpen size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />
        AI responses are for informational guidance only. Always verify eligibility criteria and deadlines on official scholarship websites before applying. ScholarMatch AI is not affiliated with any government body.
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
