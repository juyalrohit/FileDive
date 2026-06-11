import { useNavigate } from 'react-router-dom';

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// crumbs = [{ label, id }]  last item is current
export default function Breadcrumb({ crumbs = [] }) {
  const navigate = useNavigate();

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <button
        type="button"
        className={`breadcrumb-item ${crumbs.length === 0 ? 'current' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <HomeIcon />
        My Drive
      </button>

      {crumbs.map((crumb, i) => {
        const isCurrent = i === crumbs.length - 1;
        return (
          <span key={crumb.id ?? i} style={{ display: 'contents' }}>
            <span className="breadcrumb-sep"><ChevronIcon /></span>
            <button
              type="button"
              className={`breadcrumb-item ${isCurrent ? 'current' : ''}`}
              onClick={() => !isCurrent && navigate(`/folder/${crumb.id}`)}
            >
              {crumb.label}
            </button>
          </span>
        );
      })}
    </nav>
  );
}