import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import FolderCard from '../components/FolderCard';
import CreateFolderModal from '../components/CreateFolderModal';
import RenameFolderModal from '../components/RenameFolderModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { FoldersSkeleton } from '../components/LoadingSkeleton';

/* ── Icons ── */
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FolderOpenIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);


/* ── Page ── */
export default function FoldersPage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/folders');
      setFolders(res.data.folders || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async ({ name, parentFolder }) => {
    try {
      await api.post('/folders', { name, parentFolder });
      toast.success('Folder created');
      setCreateOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create folder');
    }
  };

  const handleRename = async (target, nextName) => {
    try {
      await api.patch(`/folders/${target._id}`, { name: nextName });
      toast.success('Folder renamed');
      setRenameOpen(false);
      setActiveFolder(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not rename folder');
    }
  };

  const handleDelete = async (target) => {
    try {
      await api.delete(`/folders/${target._id}`);
      toast.success('Folder deleted');
      setDeleteOpen(false);
      setActiveFolder(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete folder');
    }
  };

  const filtered = folders.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <h2 className="page-title">Folders</h2>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New folder
            </button>
          </div>
        </header>

        <main className="page-content">
          {/* Hero strip */}
          <section className="folders-hero">
            <div className="folders-hero-icon">
              <FolderOpenIcon />
            </div>
            <div className="folders-hero-copy">
              <h1 className="folders-hero-heading">All Folders</h1>
              <p className="folders-hero-sub">
                {loading ? '—' : `${folders.length} folder${folders.length !== 1 ? 's' : ''} in your drive`}
              </p>
            </div>
          </section>

          {/* Search + count bar */}
          <div className="list-toolbar">
            <div className="search-field">
              <SearchIcon />
              <input
                className="search-input"
                type="text"
                placeholder="Search folders…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {!loading && (
              <span className="list-count">
                {filtered.length} {filtered.length !== 1 ? 'folders' : 'folder'}
              </span>
            )}
          </div>

          {/* Grid */}
          <section className="section">
            {loading ? (
              <FoldersSkeleton count={6} />
            ) : filtered.length ? (
              <div className="grid-folders">
                {filtered.map(f => (
                  <FolderCard
                    key={f._id}
                    folder={f}
                    onOpen={item => navigate(`/folder/${item._id}`)}
                    onRename={item => { setActiveFolder(item); setRenameOpen(true); }}
                    onDelete={item => { setActiveFolder(item); setDeleteOpen(true); }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FolderOpenIcon />
                </div>
                <p className="empty-state-title">
                  {search ? 'No folders match your search' : 'No folders yet'}
                </p>
                <p className="empty-state-desc">
                  {search
                    ? 'Try a different keyword.'
                    : 'Create a folder to start organising your images.'}
                </p>
                {!search && (
                  <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
                    <PlusIcon /> New folder
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      <CreateFolderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        title="New folder"
      />

      <RenameFolderModal
        open={renameOpen}
        onClose={() => { setRenameOpen(false); setActiveFolder(null); }}
        onRename={handleRename}
        folder={activeFolder}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setActiveFolder(null); }}
        onConfirm={() => activeFolder && handleDelete(activeFolder)}
        itemName={activeFolder?.name || 'this folder'}
        itemType="folder"
      />
    </div>
  );
}