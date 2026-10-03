// Shared UI components for ScholarMatch AI premium design

// ── Match Score Ring (SVG circular progress) ──────────────────────────────────
interface MatchRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animate?: boolean;
}

function getRingColor(score: number): string {
  if (score >= 90) return '#16a34a';
  if (score >= 80) return '#2563eb';
  if (score >= 70) return '#d97706';
  return '#94a3b8';
}

function getRingLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Potential';
  return 'Low';
}

export function MatchRing({ score, size = 72, strokeWidth = 7, showLabel = true }: MatchRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getRingColor(score);
  const label = getRingLabel(score);

  return (
    <div className="match-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border-default)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="match-ring-text">
        <div style={{ fontSize: size * 0.22, fontWeight: 800, color }}>{score}%</div>
        {showLabel && size >= 72 && (
          <div style={{ fontSize: size * 0.125, fontWeight: 600, color: 'var(--text-muted)', marginTop: 1 }}>{label}</div>
        )}
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  change?: string;
  changeUp?: boolean;
  subtitle?: string;
  onClick?: () => void;
}

export function KpiCard({ label, value, icon, iconBg, change, changeUp, subtitle, onClick }: KpiCardProps) {
  return (
    <div className="kpi-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="kpi-icon" style={{ background: iconBg }}>{icon}</div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{subtitle}</div>}
        {change && (
          <div className="kpi-change" style={{ color: changeUp ? '#16a34a' : '#dc2626' }}>
            {changeUp ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="section-subtitle">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  label: string;
  type: 'blue' | 'green' | 'amber' | 'red' | 'violet' | 'slate' | 'teal';
  dot?: boolean;
}

export function StatusBadge({ label, type, dot }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${type}`}>
      {dot && <span className={`status-dot ${type === 'green' ? 'status-online' : ''}`} style={{ width: '6px', height: '6px' }} />}
      {label}
    </span>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>{description}</div>
      {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
    </div>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div className="skeleton" style={{ width: '3rem', height: '3rem', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: '0.875rem', width: '60%', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '0.75rem', width: '80%', marginBottom: '0.35rem' }} />
          <div className="skeleton" style={{ height: '0.75rem', width: '40%' }} />
        </div>
        <div className="skeleton" style={{ width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0 }} />
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '1.5rem', width: '5rem', borderRadius: '9999px' }} />
        <div className="skeleton" style={{ height: '1.5rem', width: '4rem', borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

// ── Alert Box ─────────────────────────────────────────────────────────────────
interface AlertBoxProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

const alertStyles: Record<string, { bg: string; border: string; color: string }> = {
  info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#065f46' },
  error:   { bg: '#fef2f2', border: '#fecaca', color: '#991b1b' },
};
const darkAlertStyles: Record<string, { bg: string; border: string; color: string }> = {
  info:    { bg: '#1e3a5f', border: '#1d4ed8', color: '#93c5fd' },
  warning: { bg: '#451a03', border: '#92400e', color: '#fcd34d' },
  success: { bg: '#064e3b', border: '#065f46', color: '#6ee7b7' },
  error:   { bg: '#450a0a', border: '#991b1b', color: '#fca5a5' },
};

export function AlertBox({ type, title, children }: AlertBoxProps) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const s = isDark ? darkAlertStyles[type] : alertStyles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: '0.75rem',
      padding: '0.875rem 1rem', color: s.color,
    }}>
      {title && <div style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.875rem' }}>{title}</div>}
      <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ── Loading Spinner ───────────────────────────────────────────────────────────
export function Spinner({ size = 24, color = 'var(--color-primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="spin" style={{ color }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
interface TabBarProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="tab-nav no-scrollbar" style={{ overflowX: 'auto' }}>
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
          style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
        >
          {t.label}
          {t.count !== undefined && (
            <span style={{
              marginLeft: '0.375rem',
              background: active === t.id ? 'var(--color-primary)' : 'var(--border-strong)',
              color: active === t.id ? '#fff' : 'var(--text-secondary)',
              borderRadius: '9999px', padding: '1px 6px', fontSize: '0.7rem', fontWeight: 700,
            }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '1rem 0' }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
      <div style={{ flex: 1, borderTop: '1px solid var(--border-default)' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, borderTop: '1px solid var(--border-default)' }} />
    </div>
  );
}
