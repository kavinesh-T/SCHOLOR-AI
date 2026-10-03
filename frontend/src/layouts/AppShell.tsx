import { useState, ReactNode, useEffect } from 'react';
import {
  LayoutDashboard, User, Sparkles, Search, Bookmark,
  Bell, Clock, ListChecks, MessageSquare, Settings,
  ChevronLeft, ChevronRight, Menu, X, Sun, Moon,
  GraduationCap, Shield, LogOut
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export type PageId =
  | 'dashboard' | 'profile' | 'matches' | 'explore'
  | 'saved' | 'deadlines' | 'tracker' | 'assistant'
  | 'notifications' | 'settings' | 'admin' | 'landing';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'profile',        label: 'My Profile',        icon: User },
  { id: 'matches',        label: 'My Matches',        icon: Sparkles, badge: 18 },
  { id: 'explore',        label: 'Explore',           icon: Search },
  { id: 'saved',          label: 'Saved',             icon: Bookmark },
  { id: 'deadlines',      label: 'Deadlines',         icon: Clock, badge: 5 },
  { id: 'tracker',        label: 'App Tracker',       icon: ListChecks },
  { id: 'assistant',      label: 'AI Assistant',      icon: MessageSquare },
  { id: 'notifications',  label: 'Notifications',     icon: Bell, badge: 3 },
  { id: 'settings',       label: 'Settings',          icon: Settings },
];

interface AppShellProps {
  children: ReactNode;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  profileComplete: number;
  notifCount?: number;
  onLogout?: () => void;
  isLoggedIn: boolean;
}

export default function AppShell({
  children, activePage, onNavigate,
  profileComplete, notifCount = 3, onLogout, isLoggedIn,
}: AppShellProps) {
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [activePage]);

  const isCollapsed = collapsed;

  return (
    <div className="app-shell" style={{ background: 'var(--bg-app)' }}>
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo row */}
        <div style={{ padding: '1rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,.08)', minHeight: '64px' }}>
          <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={16} color="white" />
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1 }}>ScholarMatch</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,.7)', marginTop: '0.15rem', fontWeight: 500 }}>AI</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="btn btn-icon"
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.06)', color: 'rgba(248,250,252,.6)', border: 'none', display: 'none' }}
            id="sidebar-collapse-btn"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, paddingTop: '0.5rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <div
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <div style={{ position: 'relative' }}>
                  <Icon size={16} className="nav-icon" />
                  {item.badge && !isCollapsed && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: '#2563eb', color: '#fff',
                      fontSize: '0.55rem', fontWeight: 700, borderRadius: '9999px',
                      padding: '1px 4px', lineHeight: 1.4,
                    }}>{item.badge}</span>
                  )}
                </div>
                {!isCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span style={{
                    background: 'rgba(37,99,235,.35)', color: '#93c5fd',
                    fontSize: '0.65rem', fontWeight: 700, borderRadius: '9999px',
                    padding: '2px 7px',
                  }}>{item.badge}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: Profile + Admin */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '0.75rem' }}>
          {/* Profile completion */}
          {!isCollapsed && isLoggedIn && (
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: '0.625rem', padding: '0.625rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,.8)', fontWeight: 600 }}>Profile Complete</span>
                <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 700 }}>{profileComplete}%</span>
              </div>
              <div className="progress-bar" style={{ height: '4px' }}>
                <div className="progress-fill" style={{ width: `${profileComplete}%`, background: 'linear-gradient(90deg,#2563eb,#7c3aed)' }} />
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="sidebar-nav-item" onClick={() => onNavigate('admin')} title={isCollapsed ? 'Admin' : undefined}>
              <Shield size={16} className="nav-icon" />
              {!isCollapsed && <span>Admin</span>}
            </div>
          )}
          {isLoggedIn && onLogout && (
            <div className="sidebar-nav-item" onClick={onLogout} title={isCollapsed ? 'Sign Out' : undefined}>
              <LogOut size={16} className="nav-icon" />
              {!isCollapsed && <span>Sign Out</span>}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 49, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ===== Main ===== */}
      <main className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <header className="top-header">
          {/* Mobile hamburger */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setMobileOpen(o => !o)}
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Desktop collapse btn */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setCollapsed(c => !c)}
            style={{ display: 'flex' }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Page title */}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {NAV_ITEMS.find(n => n.id === activePage)?.label ?? 'ScholarMatch AI'}
            </h1>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Theme toggle */}
            <button className="btn btn-icon btn-ghost" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button className="btn btn-icon btn-ghost" style={{ position: 'relative' }} onClick={() => onNavigate('notifications')}>
              <Bell size={18} />
              {notifCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '1rem', height: '1rem', background: '#dc2626',
                  borderRadius: '50%', fontSize: '0.6rem', fontWeight: 700,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg-header)',
                }}>{notifCount}</span>
              )}
            </button>

            {/* Avatar */}
            <div
              onClick={() => onNavigate('profile')}
              style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
              }}
            >
              S
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </main>

      {/* ===== Mobile Bottom Nav ===== */}
      <nav className="mobile-bottom-nav">
        {[
          { id: 'dashboard' as PageId,  icon: LayoutDashboard, label: 'Home' },
          { id: 'matches'   as PageId,  icon: Sparkles,        label: 'Matches' },
          { id: 'explore'   as PageId,  icon: Search,          label: 'Explore' },
          { id: 'deadlines' as PageId,  icon: Bell,            label: 'Alerts' },
          { id: 'profile'   as PageId,  icon: User,            label: 'Profile' },
        ].map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`mobile-nav-item ${activePage === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            {label}
          </div>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-collapse-btn { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          #sidebar-collapse-btn { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
