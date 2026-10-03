import { GraduationCap, Sparkles, ArrowRight, CheckCircle, Shield, Zap, BarChart3, Bell, BookOpen, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

const STATS = [
  { value: '516+', label: 'Scholarships Tracked' },
  { value: '18', label: 'States Covered' },
  { value: '92%', label: 'Match Accuracy' },
  { value: '₹50K+', label: 'Avg Award Value' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Build Your Profile', desc: 'Enter your academic, personal, and financial details in our guided 5-step wizard.' },
  { step: '02', title: 'AI Analyzes Eligibility', desc: 'Our Random Forest ML model evaluates you against 516+ scholarship criteria instantly.' },
  { step: '03', title: 'Get Personalized Matches', desc: 'See ranked scholarships with an explainable match score and eligibility reasons.' },
  { step: '04', title: 'Track & Apply', desc: 'Save scholarships, track deadlines, and monitor your application pipeline.' },
  { step: '05', title: 'Receive Alerts', desc: 'Opt-in for deadline reminders and new high-match scholarship notifications.' },
];

const FEATURES = [
  { icon: <Sparkles size={22} color="#2563eb" />, bg: '#dbeafe', title: 'AI Match Scoring', desc: 'Explainable AI with feature importance — know exactly why you match.' },
  { icon: <Shield size={22} color="#7c3aed" />, bg: '#ede9fe', title: 'Verified Sources', desc: 'Buddy4Study, official Govt portals, NSP, and licensed datasets.' },
  { icon: <Bell size={22} color="#059669" />, bg: '#d1fae5', title: 'Deadline Intelligence', desc: 'Color-coded urgency alerts. Never miss a deadline again.' },
  { icon: <BarChart3 size={22} color="#d97706" />, bg: '#fef3c7', title: 'ML Analytics', desc: 'Random Forest classifier trained on real eligibility patterns.' },
  { icon: <BookOpen size={22} color="#0891b2" />, bg: '#cffafe', title: 'All Categories', desc: 'Merit, Need-based, SC/ST/OBC, Minority, PWD, Sports, and more.' },
  { icon: <Zap size={22} color="#dc2626" />, bg: '#fee2e2', title: 'Instant Results', desc: 'Batch ML inference evaluates 516 scholarships in under 5ms.' },
];

export default function LandingPage({ onGetStarted, onExplore }: LandingPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1d4ed8 70%, #7c3aed 100%)',
        color: '#fff', padding: 'clamp(4rem,10vw,7rem) 1.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,99,235,.12)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: '9999px', padding: '0.375rem 1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} />
            AI-Powered Scholarship Discovery
          </div>

          <h1 className="text-display" style={{ color: '#fff', marginBottom: '1rem' }}>
            Find Scholarships<br />
            <span style={{ background: 'linear-gradient(90deg,#93c5fd,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              That Match You.
            </span>
          </h1>

          <p className="text-body-lg" style={{ color: 'rgba(248,250,252,.75)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            ScholarMatch AI analyzes your academic profile against 516+ Indian scholarships using machine learning — giving you an explainable match score and personalized recommendations.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-lg" onClick={onGetStarted} style={{ background: '#fff', color: '#1d4ed8', fontWeight: 700 }}>
              <GraduationCap size={18} />
              Check My Eligibility
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-lg btn-ghost" onClick={onExplore} style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.08)' }}>
              Explore Scholarships
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['No registration required', 'Free forever', 'Data stays private'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'rgba(248,250,252,.65)' }}>
                <CheckCircle size={13} color="#4ade80" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '0' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '1.75rem 1rem', textAlign: 'center',
              borderRight: i < 3 ? '1px solid var(--border-default)' : undefined,
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(3rem,7vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>How It Works</div>
            <h2 className="text-heading-1" style={{ color: 'var(--text-primary)' }}>From Profile to Scholarship in 5 Steps</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>No complex forms. No sign-up. Just your academic details and instant AI results.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '0.875rem', flexShrink: 0,
                  background: i === 0 ? '#dbeafe' : i === 1 ? '#ede9fe' : i === 2 ? '#d1fae5' : i === 3 ? '#fef3c7' : '#fee2e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.875rem',
                  color: i === 0 ? '#1d4ed8' : i === 1 ? '#5b21b6' : i === 2 ? '#065f46' : i === 3 ? '#92400e' : '#991b1b',
                }}>
                  {step.step}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{step.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
                {i === 1 && (
                  <span className="badge badge-violet" style={{ marginLeft: 'auto', flexShrink: 0 }}>ML Powered</span>
                )}
                {i === 0 && (
                  <span className="badge badge-blue" style={{ marginLeft: 'auto', flexShrink: 0 }}>Start Here</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(2rem,5vw,4rem) 1.5rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="badge badge-green" style={{ marginBottom: '0.75rem' }}>Features</div>
            <h2 className="text-heading-1">Everything You Need to Win Scholarships</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-interactive" style={{ padding: '1.25rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                  {f.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{f.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      <section style={{ padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.875rem', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Shield size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.7 }}>
              <strong>Important Disclaimer:</strong> ScholarMatch AI provides eligibility estimates based on publicly available scholarship information. Always verify the latest eligibility criteria and deadlines on the <strong>official scholarship website</strong> before applying. This platform does not guarantee selection or award. WhatsApp notifications require explicit opt-in and use an authorized WhatsApp Business API provider.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1d4ed8)', borderRadius: '1.25rem', padding: 'clamp(2rem,5vw,3rem)', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(124,58,237,.2)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: '0.75rem' }}>
                Ready to find your scholarship?
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Discover. Match. Apply. Succeed.
              </h2>
              <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Join thousands of students who found matching scholarships in minutes.
              </p>
              <button className="btn btn-lg" onClick={onGetStarted} style={{ background: '#fff', color: '#1d4ed8', fontWeight: 700 }}>
                <GraduationCap size={18} />
                Get My Matches
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '1.5rem', height: '1.5rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={11} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>ScholarMatch AI</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2025 ScholarMatch AI · Built with ❤️ for Indian Students · <Users size={10} style={{ display: 'inline' }} /> Not affiliated with any government body
        </div>
      </footer>
    </div>
  );
}
