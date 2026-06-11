import { useState, useRef } from 'react';
import { formatSize } from '../utils/format';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function UploadImageModal({ open, onClose, onUpload, folderId }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  if (!open) return null;

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    await onUpload({ file, folderId });
    setLoading(false);
    setFile(null);
    setPreview(null);
  };

  const handleClose = () => {
    setFile(null); setPreview(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, background: 'var(--accent-light)',
                borderRadius: 'var(--radius-md)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
              }}>
                <UploadIcon />
              </div>
              <h2 className="modal-title">Upload image</h2>
            </div>
            <p className="modal-subtitle" style={{ paddingLeft: 46 }}>JPG, PNG, GIF, or WebP — up to 10MB.</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={handleClose}><XIcon /></button>
        </div>

        <div className="modal-body">
          {!file ? (
            <div
              className={`upload-zone ${dragging ? 'dragover' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <div className="upload-zone-icon"><UploadIcon /></div>
              <p><strong>Click to upload</strong> or drag and drop</p>
              <small>PNG, JPG, GIF, WebP up to 10MB</small>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => pickFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="upload-preview">
              <img className="upload-preview-thumb" src={preview} alt="preview" />
              <div className="upload-preview-info">
                <div className="upload-preview-name">{file.name}</div>
                <div className="upload-preview-size">{formatSize(file.size)}</div>
              </div>
              <CheckIcon />
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => { setFile(null); setPreview(null); }}
                style={{ marginLeft: 4 }}
              ><XIcon /></button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}