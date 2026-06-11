import { useState, useRef, useEffect } from 'react';
import { formatSize } from '../utils/format';

const FolderOpenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
);

const OpenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

export default function FolderCard({ folder, onOpen, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Don't open folder when clicking menu
    setMenuOpen(prev => !prev);
  };

  const handleAction = (e, cb) => {
    e.stopPropagation();
    setMenuOpen(false);
    cb();
  };

  return (
    <div
      className="folder-card"
      onClick={() => onOpen(folder)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(folder)}
    >
      <div className="folder-icon-wrap">
        <FolderOpenIcon />
      </div>

      <div className="folder-card-body">
        <div className="folder-card-name" title={folder.name}>{folder.name}</div>
        <div className="folder-card-meta">
          {folder.size != null ? formatSize(folder.size) : '—'}
          {folder.itemCount != null && ` · ${folder.itemCount} item${folder.itemCount !== 1 ? 's' : ''}`}
        </div>
      </div>

      {/* 3-dot menu — only shown when onRename or onDelete provided */}
      {(onRename || onDelete) && (
        <div className="folder-card-menu" ref={menuRef}>
          <button
            className="folder-menu-btn"
            onClick={handleMenuClick}
            title="More options"
            aria-label="Folder options"
          >
            <MoreIcon />
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={e => handleAction(e, () => onOpen(folder))}
              >
                <OpenIcon /> Open
              </button>

              {onRename && (
                <button
                  className="dropdown-item"
                  onClick={e => handleAction(e, () => onRename(folder))}
                >
                  <EditIcon /> Rename
                </button>
              )}

              {onDelete && (
                <>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item dropdown-item-danger"
                    onClick={e => handleAction(e, () => onDelete(folder))}
                  >
                    <TrashIcon /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}