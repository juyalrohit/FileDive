import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HardDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    <line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const DriveLogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18l4-8 4 8H3zm7-4l4-8 4 8H10zm4 4l4-8 4 8h-8z" opacity=".5"/>
    <path d="M3 18l4-8 4 8H3z" fill="white"/>
    <path d="M10 14l4-8 4 8H10z" fill="white" opacity=".8"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <DriveLogoIcon />
        </div>
        <span className="sidebar-logo-text">FileDrive</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Navigation</span>

        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <HardDriveIcon />
          My Drive
        </NavLink>

        <button type="button" className="sidebar-nav-item" onClick={() => navigate('/folders')}>
          <FolderIcon />
          Folders
        </button>

        <button type="button" className="sidebar-nav-item" onClick={() => navigate('/images')}>
          <ImageIcon />
          Images
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" role="button" tabIndex={0}>
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={logout}
            title="Sign out"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}