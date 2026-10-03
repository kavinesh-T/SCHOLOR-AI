import { useState } from 'react';
import { Bell, BellOff, CheckCircle, Sparkles, Clock, Info, AlertTriangle, MessageSquare, Shield, ExternalLink } from 'lucide-react';
import { SectionHeader, TabBar, AlertBox } from './ui/SharedUI';

interface Notification {
  id: string;
  type: 'match' | 'deadline' | 'eligibility' | 'system' | 'alert';
  title: string;
  body: string;
  time: string;
  read: boolean;
  scholarship?: string;
}

const NOTIF_TYPE_CONFIG = {
  match:       { icon: <Sparkles size={14} />, color: '#7c3aed', bg: '#ede9fe', label: 'New Match' },
  deadline:    { icon: <Clock size={14} />,    color: '#d97706', bg: '#fef3c7', label: 'Deadline'  },
  eligibility: { icon: <CheckCircle size={14} />, color: '#059669', bg: '#d1fae5', label: 'Eligibility Update' },
  system:      { icon: <Info size={14} />,     color: '#0891b2', bg: '#cffafe', label: 'System' },
  alert:       { icon: <AlertTriangle size={14} />, color: '#dc2626', bg: '#fee2e2', label: 'Alert' },
};

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'alert',  title: 'INSPIRE Scholarship closes tomorrow!', body: 'The deadline for INSPIRE Scholarship for Higher Education (DST) is October 1, 2025. Apply now on online-inspire.gov.in', time: '2 hours ago', read: false, scholarship: 'INSPIRE' },
  { id: '2', type: 'match',  title: 'New high-match scholarship detected', body: 'Swami Vivekananda Merit-cum-Means Scholarship matches your profile at 94%. Deadline: Oct 7, 2025.', time: '4 hours ago', read: false, scholarship: 'Swami Vivekananda' },
  { id: '3', type: 'eligibility', title: 'Eligibility update: NSP OBC-NCL', body: 'New OBC-NCL income limits for 2025-26: ₹8 lakh/year (updated from ₹6 lakh). You may now be eligible.', time: '1 day ago', read: true },
  { id: '4', type: 'deadline', title: 'PM National Relief Fund — 3 days left', body: 'Application deadline is October 3, 2025. You saved this scholarship. Don\'t miss it!', time: '1 day ago', read: true, scholarship: 'PM Relief' },
  { id: '5', type: 'match',  title: '5 new scholarships added today', body: 'HDFC Parivartan, TCS Ignite, Kotak Mahindra, Mahindra Pride, and 1 more were added to the database.', time: '2 days ago', read: true },
  { id: '6', type: 'system', title: 'Profile analysis complete', body: 'Your profile was re-analyzed. We found 18 matching scholarships — 7 with ≥80% match score.', time: '3 days ago', read: true },
];

const MATCH_THRESHOLDS = [70, 75, 80, 85, 90, 95];

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  // WhatsApp Opt-in state
  const [waOptIn, setWaOptIn] = useState(false);
  const [waPhone, setWaPhone] = useState('');
  const [waThreshold, setWaThreshold] = useState(80);
  const [waConfirmed, setWaConfirmed] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const filtered = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* WhatsApp Alert Center */}
      <div className="card" style={{ padding: '1.5rem', border: '1px solid #bbf7d0', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageSquare size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#065f46' }}>WhatsApp Alert Center</div>
            <div style={{ fontSize: '0.8rem', color: '#047857' }}>Opt-in for scholarship alerts via WhatsApp Business API</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-green">Explicit Opt-In Required</span>
          </div>
        </div>

        <AlertBox type="info" title="How WhatsApp alerts work">
          Alerts are delivered via an authorized WhatsApp Business API provider. You must explicitly opt in by entering your phone number and confirming. You can opt out at any time by replying STOP to any message.
        </AlertBox>

        {!waOptIn ? (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="form-input"
              placeholder="+91 XXXXX XXXXX"
              value={waPhone}
              onChange={e => setWaPhone(e.target.value)}
              style={{ flex: 1, minWidth: '180px', maxWidth: '240px' }}
            />
            <select
              className="form-input form-select"
              value={waThreshold}
              onChange={e => setWaThreshold(Number(e.target.value))}
              style={{ width: 'auto' }}
            >
              {MATCH_THRESHOLDS.map(t => (
                <option key={t} value={t}>Matches ≥{t}%</option>
              ))}
            </select>
            <button
              className="btn btn-sm"
              onClick={() => { if (waPhone.trim()) { setWaOptIn(true); setWaConfirmed(false); } }}
              style={{ background: '#16a34a', color: '#fff' }}
              disabled={!waPhone.trim()}
            >
              Enable WhatsApp Alerts
            </button>
          </div>
        ) : !waConfirmed ? (
          <div style={{ marginTop: '1rem' }}>
            <AlertBox type="warning" title="Confirm your opt-in">
              We'll send a confirmation message to <strong>{waPhone}</strong>. Reply YES to confirm. Match threshold: ≥{waThreshold}%.
            </AlertBox>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button className="btn btn-sm" onClick={() => setWaConfirmed(true)} style={{ background: '#16a34a', color: '#fff' }}>
                <CheckCircle size={13} /> I've Confirmed via WhatsApp
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setWaOptIn(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <AlertBox type="success" title="WhatsApp alerts active">
              You'll receive alerts for scholarships ≥{waThreshold}% match on {waPhone}. Reply STOP anytime to opt out.
            </AlertBox>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => { setWaOptIn(false); setWaConfirmed(false); setWaPhone(''); }}>
              <BellOff size={13} /> Opt Out
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div className="section-title">Notifications</div>
            {unread > 0 && <div className="section-subtitle">{unread} unread</div>}
          </div>
          {unread > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
              <CheckCircle size={13} /> Mark all read
            </button>
          )}
        </div>

        <TabBar
          tabs={[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unread },
            { id: 'match', label: 'Matches', count: notifications.filter(n => n.type === 'match').length },
            { id: 'deadline', label: 'Deadlines', count: notifications.filter(n => n.type === 'deadline').length },
            { id: 'eligibility', label: 'Eligibility', count: notifications.filter(n => n.type === 'eligibility').length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ marginBottom: '0.5rem' }} />
              <div>No notifications</div>
            </div>
          ) : filtered.map(notif => {
            const config = NOTIF_TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                style={{
                  display: 'flex', gap: '0.875rem', padding: '0.875rem',
                  borderRadius: '0.75rem', cursor: 'pointer',
                  background: notif.read ? 'transparent' : `${config.bg}`,
                  border: `1px solid ${notif.read ? 'var(--border-default)' : config.color + '33'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', flexShrink: 0,
                  background: config.bg, color: config.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {config.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: !notif.read ? 700 : 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {notif.title}
                    </span>
                    {!notif.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: config.color, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                    <span className={`badge badge-${notif.type === 'match' ? 'violet' : notif.type === 'deadline' ? 'amber' : notif.type === 'eligibility' ? 'green' : 'blue'}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy note */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 0.25rem' }}>
        <Shield size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          WhatsApp alerts use an authorized WhatsApp Business API provider. Your phone number is used solely for scholarship notifications and will never be shared or used for marketing without additional consent.
        </span>
      </div>
    </div>
  );
}

export default NotificationCenter;
