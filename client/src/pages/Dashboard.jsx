import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import FolderCard from '../components/FolderCard';
import ImageCard from '../components/ImageCard';
import CreateFolderModal from '../components/CreateFolderModal';
import RenameFolderModal from '../components/RenameFolderModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EmptyState from '../components/EmptyState';
import { FoldersSkeleton } from '../components/LoadingSkeleton';
import { formatSize } from '../utils/format';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const FolderStatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const ImageStatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const StorageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [recentImages, setRecentImages] = useState([]);
  const [stats, setStats] = useState({ folders: 0, images: 0, storage: 0 });
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/folders');
      setFolders(res.data.folders || []);
      setRecentImages(res.data.recentImages || []);
      
    } catch (err) {
      toast.error('Could not load your drive');
    } finally {
      setLoading(false);
    }
  };

   const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stats');
     
      setStats({
        folders: res.data.totalFolders ?? 0,
        images: res.data.totalImages ?? 0,
        storage: res.data.totalStorage ?? 0,
      });
    } catch (err) {
      toast.error('Could not load your drive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load();
    loadStats()
   }, []);

  const handleCreateFolder = async ({ name }) => {
    try {
      await api.post('/folders', { name });
      toast.success('Folder created');
      setCreateOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create folder');
    }
  };

  const handleRenameFolder = async (targetFolder, nextName) => {
    try {
      await api.patch(`/folders/${targetFolder._id}`, { name: nextName });
      toast.success('Folder renamed');
      setRenameOpen(false);
      setActiveFolder(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not rename folder');
    }
  };

  const handleDeleteFolder = async (targetFolder) => {
    try {
      await api.delete(`/folders/${targetFolder._id}`);
      toast.success('Folder deleted');
      setDeleteOpen(false);
      setActiveFolder(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete folder');
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      await api.delete(`/images/${image._id}`);
      toast.success('Image deleted');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete image');
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>My Drive</span>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New folder
            </button>
          </div>
        </header>

        <main className="page-content">
          {/* Greeting */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 4 }}>
              Good {getGreeting()}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Here's an overview of your drive.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#EEF1FE' }}><FolderStatIcon /></div>
              <div>
                <div className="stat-label">Folders</div>
                <div className="stat-value">{stats.folders}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ECFDF5' }}><ImageStatIcon /></div>
              <div>
                <div className="stat-label">Images</div>
                <div className="stat-value">{stats.images}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFFBEB' }}><StorageIcon /></div>
              <div>
                <div className="stat-label">Storage used</div>
                <div className="stat-value">{formatSize(stats.storage)}</div>
              </div>
            </div>
          </div>

          {/* Folders */}
          <section className="section">
            <div className="section-header">
              <span className="section-title">
                Folders
                <span className="section-count">{folders.length}</span>
              </span>
            </div>
            {loading ? (
              <FoldersSkeleton count={4} />
            ) : folders.length ? (
              <div className="grid-folders">
                {folders.map(f => (
                  <FolderCard
                    key={f._id}
                    folder={f}
                    onOpen={item => navigate(`/folder/${item._id}`)}
                    onRename={folder => { setActiveFolder(folder); setRenameOpen(true); }}
                    onDelete={folder => { setActiveFolder(folder); setDeleteOpen(true); }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type="folder"
                description="Create your first folder to start organizing files."
                action="New folder"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </section>

          {/* Recent images */}
          {recentImages.length > 0 && (
            <section className="section">
              <div className="section-header">
                <span className="section-title">Recent images</span>
              </div>
              <div className="grid-images">
                {recentImages.slice(0, 8).map(img => (
                  <ImageCard key={img._id} image={img} onDelete={handleDeleteImage} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <CreateFolderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateFolder}
        title="New folder"
      />

      <RenameFolderModal
        open={renameOpen}
        onClose={() => { setRenameOpen(false); setActiveFolder(null); }}
        onRename={handleRenameFolder}
        folder={activeFolder}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setActiveFolder(null); }}
        onConfirm={() => activeFolder && handleDeleteFolder(activeFolder)}
        itemName={activeFolder?.name || 'this folder'}
        itemType="folder"
      />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}