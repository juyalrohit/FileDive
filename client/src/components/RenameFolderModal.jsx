import { useState, useEffect } from 'react';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export default function RenameFolderModal({ open, onClose, onRename, folder }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (folder) setName(folder.name || '');
  }, [folder]);

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === folder?.name) return;
    setLoading(true);
    await onRename(folder, trimmed);
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, background: 'var(--accent-light)',
                borderRadius: 'var(--radius-md)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <EditIcon />
              </div>
              <h2 className="modal-title">Rename folder</h2>
            </div>
            <p className="modal-subtitle" style={{ paddingLeft: 46 }}>
              Renaming <strong style={{ color: 'var(--text-primary)' }}>{folder?.name}</strong>
            </p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">
              New name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter folder name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!name.trim() || name.trim() === folder?.name || loading}
          >
            {loading ? 'Saving…' : 'Save name'}
          </button>
        </div>
      </div>
    </div>
  );
}