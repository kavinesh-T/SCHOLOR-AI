import { useState } from 'react';
import { CheckCircle, Circle, ChevronRight, Award, Clock } from 'lucide-react';
import { SectionHeader, TabBar } from './ui/SharedUI';

type StepStatus = 'done' | 'active' | 'pending';

interface ApplicationItem {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  step: number;
  category: string;
}

const PIPELINE_STEPS = [
  { id: 0, label: 'Interested' },
  { id: 1, label: 'Saved' },
  { id: 2, label: 'Docs Ready' },
  { id: 3, label: 'Started' },
  { id: 4, label: 'Submitted' },
  { id: 5, label: 'Verification' },
  { id: 6, label: 'Result' },
];

const SAMPLE_APPS: ApplicationItem[] = [
  { id: '1', name: 'INSPIRE Scholarship for Higher Education', provider: 'DST, Govt of India', amount: '₹80,000/yr', deadline: 'Oct 1, 2025', step: 4, category: 'Merit' },
  { id: '2', name: 'Swami Vivekananda Merit-cum-Means Scholarship', provider: 'West Bengal Govt', amount: '₹60,000/yr', deadline: 'Oct 7, 2025', step: 2, category: 'Merit-cum-Means' },
  { id: '3', name: 'NSP Post-Matric SC/ST Scholarship', provider: 'Ministry of Social Justice', amount: '₹23,400/yr', deadline: 'Oct 15, 2025', step: 1, category: 'SC/ST' },
  { id: '4', name: 'AICTE Pragati Scholarship', provider: 'AICTE', amount: '₹50,000', deadline: 'Nov 30, 2025', step: 0, category: 'Women/Merit' },
  { id: '5', name: 'HDFC Bank Educational Crisis Scholarship', provider: 'HDFC Bank Parivartan', amount: '₹75,000', deadline: 'Oct 20, 2025', step: 6, category: 'CSR/Private' },
];

const STEP_COLORS: Record<StepStatus, { circle: string; text: string }> = {
  done:    { circle: '#059669', text: '#065f46' },
  active:  { circle: '#2563eb', text: '#1d4ed8' },
  pending: { circle: '#cbd5e1', text: '#94a3b8' },
};

export default function ApplicationTracker() {
  const [activeTab, setActiveTab] = useState('all');
  const [apps, setApps] = useState<ApplicationItem[]>(SAMPLE_APPS);

  const filtered = activeTab === 'all'
    ? apps
    : activeTab === 'inprogress'
    ? apps.filter(a => a.step > 0 && a.step < 6)
    : activeTab === 'submitted'
    ? apps.filter(a => a.step >= 4)
    : apps.filter(a => a.step === 0);

  function advanceStep(id: string) {
    setApps(prev => prev.map(a => a.id === id && a.step < 6 ? { ...a, step: a.step + 1 } : a));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Tracking',    value: apps.length,                            bg: '#dbeafe', color: '#1d4ed8' },
          { label: 'In Progress', value: apps.filter(a => a.step > 0 && a.step < 6).length, bg: '#fef3c7', color: '#92400e' },
          { label: 'Submitted',   value: apps.filter(a => a.step >= 4).length,   bg: '#d1fae5', color: '#065f46' },
          { label: 'Results In',  value: apps.filter(a => a.step === 6).length,  bg: '#ede9fe', color: '#5b21b6' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <SectionHeader title="Application Pipeline" subtitle="Track your scholarship applications across all stages" />

        <TabBar
          tabs={[
            { id: 'all',        label: 'All',         count: apps.length },
            { id: 'interested', label: 'Interested',  count: apps.filter(a => a.step === 0).length },
            { id: 'inprogress', label: 'In Progress', count: apps.filter(a => a.step > 0 && a.step < 6).length },
            { id: 'submitted',  label: 'Submitted',   count: apps.filter(a => a.step >= 4).length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map(app => (
            <ApplicationCard key={app.id} app={app} onAdvance={() => advanceStep(app.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ app, onAdvance }: { app: ApplicationItem; onAdvance: () => void }) {
  return (
    <div className="card" style={{ padding: '1.25rem', border: app.step === 6 ? '1px solid #bbf7d0' : undefined }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Award size={16} color="#1d4ed8" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{app.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.provider}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">{app.category}</span>
            <span className="badge badge-green">{app.amount}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{app.deadline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: 'var(--text-muted)', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
            <Clock size={10} /> Deadline
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ position: 'relative' }}>
        {/* Connector line */}
        <div style={{ position: 'absolute', top: '1.125rem', left: '1rem', right: '1rem', height: '2px', background: 'var(--border-default)', zIndex: 0 }} />
        <div style={{
          position: 'absolute', top: '1.125rem', left: '1rem', height: '2px', zIndex: 0,
          width: `${(app.step / (PIPELINE_STEPS.length - 1)) * 100}%`,
          background: 'linear-gradient(90deg,#059669,#2563eb)',
          transition: 'width 0.6s ease',
        }} />

        <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          {PIPELINE_STEPS.map((step, i) => {
            const status: StepStatus = i < app.step ? 'done' : i === app.step ? 'active' : 'pending';
            const c = STEP_COLORS[status];
            return (
              <div key={step.id} className="pipeline-step">
                <div className={`pipeline-step-circle ${status}`} style={{
                  background: status === 'done' ? c.circle : status === 'active' ? c.circle : 'var(--bg-card)',
                  borderColor: status === 'pending' ? 'var(--border-default)' : c.circle,
                  color: status === 'pending' ? 'var(--text-muted)' : '#fff',
                  boxShadow: status === 'active' ? `0 0 0 4px ${c.circle}22` : undefined,
                }}>
                  {status === 'done' ? <CheckCircle size={12} color="#fff" /> : <span style={{ fontSize: '0.65rem' }}>{i + 1}</span>}
                </div>
                <div className="pipeline-label" style={{ color: status === 'pending' ? 'var(--text-muted)' : c.text }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        {app.step < 6 ? (
          <button className="btn btn-primary btn-sm" onClick={onAdvance}>
            {PIPELINE_STEPS[app.step + 1]?.label ?? 'Complete'} <ChevronRight size={13} />
          </button>
        ) : (
          <span className="badge badge-green" style={{ padding: '0.4rem 1rem' }}>
            <CheckCircle size={12} /> Result Received
          </span>
        )}
      </div>
    </div>
  );
}
