import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ImageCard from '../components/ImageCard';
import UploadImageModal from '../components/UploadImageModal';
import { ImagesSkeleton } from '../components/LoadingSkeleton';
import { formatSize } from '../utils/format';

/* ── Icons ── */
const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);



/* ── Page ── */
export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/images');
      setImages(res.data.images || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async ({ file, folderId }) => {
    if (!file) return;
    try {
      const form = new FormData();
      form.append('image', file);
      if (folderId) form.append('folderId', folderId);
      await api.post('/images/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded');
      setUploadOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async (image) => {
    try {
      await api.delete(`/images/${image._id}`);
      toast.success('Image deleted');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete image');
    }
  };

  const filtered = images.filter(img =>
    (img.originalName || img.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = images.reduce((acc, img) => acc + (img.size || 0), 0);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <h2 className="page-title">Images</h2>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
              <UploadIcon /> Upload
            </button>
          </div>
        </header>

        <main className="page-content">
          {/* Hero strip */}
          <section className="folders-hero">
            <div className="folders-hero-icon images-hero-icon">
              <ImageIcon />
            </div>
            <div className="folders-hero-copy">
              <h1 className="folders-hero-heading">All Images</h1>
              <p className="folders-hero-sub">
                {loading
                  ? '—'
                  : `${images.length} image${images.length !== 1 ? 's' : ''} · ${formatSize(totalSize)} total`}
              </p>
            </div>
          </section>

          {/* Toolbar */}
          <div className="list-toolbar">
            <div className="search-field">
              <SearchIcon />
              <input
                className="search-input"
                type="text"
                placeholder="Search images…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar-right">
              {!loading && (
                <span className="list-count">
                  {filtered.length} {filtered.length !== 1 ? 'images' : 'image'}
                </span>
              )}
              <div className="view-toggle">
                <button
                  className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                  title="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  className={`view-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                  title="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <section className="section">
            {loading ? (
              <ImagesSkeleton count={8} />
            ) : filtered.length ? (
              view === 'grid' ? (
                <div className="grid-images">
                  {filtered.map(img => (
                    <ImageCard key={img._id} image={img} onDelete={handleDelete} />
                  ))}
                </div>
              ) : (
                <div className="images-list">
                  {filtered.map(img => (
                    <div key={img._id} className="image-list-row">
                      <div className="image-list-thumb">
                        {img.url
                          ? <img src={img.url} alt={img.originalName || img.filename} />
                          : <div className="image-list-thumb-placeholder"><ImageIcon /></div>
                        }
                      </div>
                      <div className="image-list-info">
                        <span className="image-list-name">{img.originalName || img.filename || 'Untitled'}</span>
                        <span className="image-list-meta">{formatSize(img.size || 0)}</span>
                      </div>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDelete(img)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon images-empty-icon">
                  <ImageIcon />
                </div>
                <p className="empty-state-title">
                  {search ? 'No images match your search' : 'No images yet'}
                </p>
                <p className="empty-state-desc">
                  {search
                    ? 'Try a different keyword.'
                    : 'Upload your first image to get started.'}
                </p>
                {!search && (
                  <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
                    <UploadIcon /> Upload image
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      <UploadImageModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}