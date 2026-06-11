const FolderIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const icons = { folder: <FolderIcon />, image: <ImageIcon /> };

export default function EmptyState({ type = 'folder', title, description, action, onAction }) {
  const defaultTitle = type === 'folder' ? 'No folders yet' : 'No images yet';
  const defaultDesc = type === 'folder'
    ? 'Create a folder to organize your files.'
    : 'Upload an image to get started.';

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icons[type]}</div>
      <h3>{title ?? defaultTitle}</h3>
      <p>{description ?? defaultDesc}</p>
      {action && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}