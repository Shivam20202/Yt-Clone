import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../api/axios.js';
import './ChannelPage.css';

const CATEGORIES = [
  'All', 'Web Development', 'JavaScript', 'Data Structures',
  'Server', 'Music', 'Information Technology', 'Gaming',
  'Live', 'Spring Framework', 'Education', 'Entertainment',
];

function formatViews(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (d === 0) return 'today';
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/* ─── Channel Video Card with owner menu ────────────────────────── */
function VideoOwnerCard({ video, isOwner, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const placeholder = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=640&h=360&fit=crop';

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="cp-video-card">
      <Link to={`/watch/${video._id}`} className="cp-video-thumb">
        <img
          src={video.thumbnailUrl || placeholder}
          alt={video.title}
          onError={(e) => { e.target.src = placeholder; }}
        />
      </Link>
      <div className="cp-video-info-row">
        <div className="cp-video-info">
          <Link to={`/watch/${video._id}`} className="cp-video-title">{video.title}</Link>
          <p className="cp-video-meta">{formatViews(video.views)} views &bull; {timeAgo(video.uploadDate || video.createdAt)}</p>
        </div>
        {isOwner && (
          <div className="cp-video-menu-wrap" ref={menuRef}>
            <button
              className="cp-video-menu-btn"
              onClick={(e) => { e.preventDefault(); setMenuOpen((p) => !p); }}
              aria-label="Video options"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="cp-video-dropdown">
                <button className="cp-video-dropdown-item" onClick={() => { onEdit(); setMenuOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Edit
                </button>
                <button className="cp-video-dropdown-item cp-video-dropdown-delete" onClick={() => { onDelete(); setMenuOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Video Upload / Edit Modal ─────────────────────────────────── */
function VideoModal({ channelId, editVideo, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: editVideo?.title || '',
    description: editVideo?.description || '',
    thumbnailUrl: editVideo?.thumbnailUrl || '',
    videoUrl: editVideo?.videoUrl || '',
    category: editVideo?.category || 'All',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title is required'); return; }
    setLoading(true); setErr('');
    try {
      if (editVideo) {
        await api.put(`/videos/${editVideo._id}`, form);
      } else {
        await api.post('/videos', { ...form, channelId });
      }
      onSaved();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{editVideo ? 'Edit video' : 'Upload video'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="mf-group">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={set('title')} placeholder="Video title" />
          </div>
          <div className="mf-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Describe your video" />
          </div>
          <div className="mf-group">
            <label>Thumbnail URL</label>
            <input type="url" value={form.thumbnailUrl} onChange={set('thumbnailUrl')} placeholder="https://..." />
          </div>
          <div className="mf-group">
            <label>Video URL</label>
            <input type="url" value={form.videoUrl} onChange={set('videoUrl')} placeholder="https://..." />
          </div>
          <div className="mf-group">
            <label>Category</label>
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {err && <p className="modal-err">{err}</p>}
          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? 'Saving...' : editVideo ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Create Channel Modal ───────────────────────────────────────── */
function CreateChannelModal({ onClose, onCreated }) {
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = name
    ? '@' + name.replace(/\s+/g, '').toLowerCase().slice(0, 20) + Math.random().toString(36).slice(2, 6)
    : '@handle';

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Channel name is required'); return; }
    setLoading(true); setErr('');
    try {
      const { data } = await api.post('/channels', { channelName: name, description: desc });
      await refreshUser();
      onCreated(data._id);
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="create-modal-title">How you'll appear</h2>

        <div className="create-avatar-area">
          <div className="create-avatar-circle">
            <svg viewBox="0 0 24 24" fill="#90caf9" width="52" height="52">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <button className="create-select-pic">Select picture</button>
        </div>

        <form className="create-form" onSubmit={handleCreate}>
          <div className="create-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Channel name"
            />
          </div>
          <div className="create-field">
            <label>Handle</label>
            <input type="text" value={handle} readOnly className="handle-input" />
          </div>

          <p className="create-legal">
            By clicking Create Channel you agree to YouTube's Terms of Service. Changes made to your
            name and profile picture are visible only on YouTube.
          </p>

          {err && <p className="modal-err">{err}</p>}

          <div className="create-modal-actions">
            <button type="button" className="create-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-confirm-btn" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main ChannelPage ───────────────────────────────────────────── */
export default function ChannelPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { mode } = useSidebar();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Videos');

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isCreate = id === 'create';
  const isOwner = user && channel && channel.owner?.toString() === user._id;

  useEffect(() => {
    if (isCreate) {
      if (!user) { navigate('/auth'); return; }
      setLoading(false);
      setShowCreateModal(true);
      return;
    }
    fetchChannel();
  }, [id]);

  const fetchChannel = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/channels/${id}`);
      setChannel(data);
    } catch {
      setError('Channel not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchChannel();
    } catch {}
  };

  const sidebarClass = mode === 'expanded' ? 'cp-with-sidebar-expanded' : mode === 'mini' ? 'cp-with-sidebar-mini' : '';

  if (isCreate && showCreateModal) {
    return (
      <>
        <Header />
        <Sidebar />
        <div style={{ marginTop: 'var(--header-height)', minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <CreateChannelModal
            onClose={() => navigate(-1)}
            onCreated={(cid) => navigate(`/channel/${cid}`)}
          />
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="cp-page">
        <Header />
        <Sidebar />
        <div className="cp-loading"><div className="vp-spinner" /></div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="cp-page">
        <Header />
        <Sidebar />
        <div className="cp-error">
          <p>{error || 'Channel not found'}</p>
          <Link to="/" className="cp-back-link">Go Home</Link>
        </div>
      </div>
    );
  }

  const videos = channel.videos || [];

  return (
    <div className="cp-page">
      <Header />
      <Sidebar />

      <div className={`cp-body ${sidebarClass}`}>
        {/* Banner */}
        <div
          className="cp-banner"
          style={{
            backgroundImage: channel.channelBanner
              ? `url(${channel.channelBanner})`
              : 'linear-gradient(135deg, #1c62b9, #0d47a1)',
          }}
        />

        {/* Channel header */}
        <div className="cp-channel-header">
          <div className="cp-avatar-wrap">
            {channel.channelAvatar ? (
              <img src={channel.channelAvatar} alt={channel.channelName} className="cp-avatar-img" />
            ) : (
              <div className="cp-avatar-placeholder">
                {channel.channelName?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="cp-channel-meta">
            <h1 className="cp-channel-name">{channel.channelName}</h1>
            <p className="cp-channel-sub-line">
              {channel.handle && <span>{channel.handle} &bull; </span>}
              <span>{channel.subscribers?.length || 0} subscribers &bull; {videos.length} videos</span>
            </p>
            {channel.description && (
              <p className="cp-channel-desc">
                {channel.description.slice(0, 100)}
                {channel.description.length > 100 && (
                  <span className="cp-desc-more"> ...more</span>
                )}
              </p>
            )}

            <div className="cp-channel-btns">
              {isOwner ? (
                <>
                  <button className="cp-btn cp-btn-secondary" onClick={() => {
                    setEditingVideo(null);
                    setShowVideoModal(true);
                  }}>
                    + Upload video
                  </button>
                  <button className="cp-btn cp-btn-secondary">Customize channel</button>
                  <button className="cp-btn cp-btn-secondary" onClick={() => {
                    setEditingVideo(null);
                    setShowVideoModal(true);
                  }}>
                    Manage videos
                  </button>
                </>
              ) : (
                <button className="cp-btn cp-btn-subscribe">Subscribe</button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="cp-tabs-bar">
          {['Home', 'Videos', 'Posts'].map((tab) => (
            <button
              key={tab}
              className={`cp-tab ${activeTab === tab ? 'cp-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="cp-tab-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cp-content">
          {videos.length === 0 ? (
            <div className="cp-empty">
              {isOwner ? (
                <div className="cp-empty-inner">
                  <svg viewBox="0 0 24 24" fill="#555" width="56" height="56">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                  <p>No videos yet</p>
                  <button className="cp-btn cp-btn-secondary" onClick={() => setShowVideoModal(true)}>
                    Upload your first video
                  </button>
                </div>
              ) : (
                <p>This channel has no videos yet.</p>
              )}
            </div>
          ) : (
            <>
              <p className="cp-section-heading">For You</p>
              <div className="cp-video-grid">
                {videos.map((video) => (
                  <VideoOwnerCard
                    key={video._id}
                    video={video}
                    isOwner={isOwner}
                    onEdit={() => { setEditingVideo(video); setShowVideoModal(true); }}
                    onDelete={() => handleDelete(video._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showVideoModal && (
        <VideoModal
          channelId={id}
          editVideo={editingVideo}
          onClose={() => { setShowVideoModal(false); setEditingVideo(null); }}
          onSaved={() => { setShowVideoModal(false); setEditingVideo(null); fetchChannel(); }}
        />
      )}
    </div>
  );
}
