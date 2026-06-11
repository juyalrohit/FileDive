import { useState } from 'react';
import { formatSize, formatDisplayName } from '../utils/format';
import DeleteConfirmModal from './DeleteConfirmModal';

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ImageCard({ image, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const displayName = formatDisplayName(image?.name || image?.url);

  return (
    <>
      <div className="image-card">
        <div className="image-card-thumb">
          <img src={image.url} alt={displayName} loading="lazy" />
          <div className="image-card-thumb-label" title={displayName}>
            {displayName}
          </div>
          <div className="image-card-overlay">
            <div className="image-card-overlay-btns">
              <button
                className="btn btn-icon btn-sm"
                style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--text-primary)' }}
                onClick={() => setLightboxOpen(true)}
                title="Preview"
              >
                <ExpandIcon />
              </button>
              <button
                className="btn btn-icon btn-sm"
                style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
                onClick={() => setShowDeleteModal(true)}
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="image-card-info">
          <div className="image-card-name" title={displayName}>{displayName}</div>
          {image.size && <div className="image-card-size">{formatSize(image.size)}</div>}
        </div>
      </div>

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => { onDelete(image); setShowDeleteModal(false); }}
        itemName={displayName}
        itemType="image"
      />

      {lightboxOpen && (
        <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <img
            className="lightbox-img"
            src={image.url}
            alt={displayName}
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <XIcon />
          </button>
        </div>
      )}
    </>
  );
}