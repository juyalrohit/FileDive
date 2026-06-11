import { useState } from 'react';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const FolderPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
  </svg>
);

export default function CreateFolderModal({ open, onClose, onCreate, parentFolder, title = 'New folder' }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onCreate({ name: name.trim(), parentFolder });
    setLoading(false);
    setName('');
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
                <FolderPlusIcon />
              </div>
              <h2 className="modal-title">{title}</h2>
            </div>
            <p className="modal-subtitle" style={{ paddingLeft: 46 }}>Give your folder a descriptive name.</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">
              Folder name <span>*</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Project Assets"
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
            disabled={!name.trim() || loading}
          >
            {loading ? 'Creating…' : 'Create folder'}
          </button>
        </div>
      </div>
    </div>
  );
}