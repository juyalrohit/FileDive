import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import FolderCard from '../components/FolderCard';
import ImageCard from '../components/ImageCard';
import CreateFolderModal from '../components/CreateFolderModal';
import UploadImageModal from '../components/UploadImageModal';
import RenameFolderModal from '../components/RenameFolderModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EmptyState from '../components/EmptyState';
import { FoldersSkeleton, ImagesSkeleton } from '../components/LoadingSkeleton';
import { formatSize } from '../utils/format';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export default function FolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/folders/${folderId}`);
    
      setFolder(res.data.folder || null);
      setFolders(res.data.folders || []);
      setImages(res.data.images || []);
      setBreadcrumbs(res.data.breadcrumbs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load folder');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [folderId]);

  const handleCreateFolder = async ({ name, parentFolder }) => {
    try {
      await api.post('/folders', { name, parentFolder });
      toast.success('Subfolder created');
      setCreateOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create folder');
    }
  };

  const handleUploadImage = async ({ file, folderId: fid }) => {
    if (!file) return;
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('folderId', fid);
      await api.post('/images/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded');
      setUploadOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
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

  const openRenameModal = (targetFolder) => {
    setActiveFolder(targetFolder);
    setRenameOpen(true);
  };

  const openDeleteModal = (targetFolder) => {
    setActiveFolder(targetFolder);
    setDeleteOpen(true);
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

      if (targetFolder._id === folderId) {
        navigate('/dashboard');
        return;
      }

      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete folder');
    }
  };

  // Build crumbs: response breadcrumbs + current folder
  const crumbs = [
    ...breadcrumbs,
    folder ? { label: folder.name, id: folderId } : null,
  ].filter(Boolean);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb">
            {/* Pass all but last to Breadcrumb (last = current) */}
            <Breadcrumb crumbs={crumbs} />
          </div>
          <div className="topbar-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New folder
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
              <UploadIcon /> Upload
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="page-content">
          {folder && (
            <section className="folder-hero">
              <div className="folder-hero-main">
                <div className="folder-hero-icon">
                  <FolderIcon />
                </div>
                <div className="folder-hero-copy">
                  <span className="folder-hero-kicker">Current folder</span>
                  <h1 className="folder-hero-title">{folder.name}</h1>
                  <p className="folder-hero-subtitle">
                    Keep related work together, rename it when the project changes, or delete it when it is no longer needed.
                  </p>
                  <div className="folder-hero-badges">
                    <span className="folder-chip">{folders.length} subfolders</span>
                    <span className="folder-chip">{images.length} images</span>
                    <span className="folder-chip">{formatSize(folder.totalSize || 0)} used</span>
                  </div>
                </div>
              </div>

              <div className="folder-hero-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openRenameModal(folder)}>
                  <EditIcon /> Rename
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => openDeleteModal(folder)}>
                  <TrashIcon /> Delete
                </button>
              </div>
            </section>
          )}

          {/* Folders section */}
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
                    onRename={openRenameModal}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type="folder"
                description="No subfolders here. Create one to organize your images."
                action="New folder"
                onAction={() => setCreateOpen(true)}
              />
            )}
          </section>

          {/* Images section */}
          <section className="section">
            <div className="section-header">
              <span className="section-title">
                Images
                <span className="section-count">{images.length}</span>
              </span>
            </div>

            {loading ? (
              <ImagesSkeleton count={6} />
            ) : images.length ? (
              <div className="grid-images">
                {images.map(img => (
                  <ImageCard key={img._id} image={img} onDelete={handleDeleteImage} />
                ))}
              </div>
            ) : (
              <EmptyState
                type="image"
                description="No images in this folder. Upload one to get started."
                action="Upload image"
                onAction={() => setUploadOpen(true)}
              />
            )}
          </section>
        </main>
      </div>

      <CreateFolderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateFolder}
        parentFolder={folderId}
        title="New subfolder"
      />

      <UploadImageModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUploadImage}
        folderId={folderId}
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