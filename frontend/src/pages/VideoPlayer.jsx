import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../api/axios.js';
import './VideoPlayer.css';

//Video player page is defined here

function formatViews(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function timeAgo(date) {
  if (!date) return '';
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m > 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo > 1 ? 's' : ''} ago`;
  return `${Math.floor(mo / 12)} year${Math.floor(mo / 12) > 1 ? 's' : ''} ago`;
}

function CommentItem({ comment, currentUser, videoId, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isOwn = currentUser && currentUser._id === comment.userId;

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        {comment.avatar ? (
          <img src={comment.avatar} alt={comment.username} />
        ) : (
          <span>{comment.username?.slice(0, 1).toUpperCase()}</span>
        )}
      </div>
      <div className="comment-body">
        <div className="comment-header-row">
          <span className="comment-username">@{comment.username}</span>
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
        <div className="comment-footer">
          <button className="comment-react-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
            </svg>
          </button>
          <button className="comment-react-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
            </svg>
          </button>
          <button className="comment-reply-btn">Reply</button>
        </div>
      </div>
      {isOwn && (
        <div className="comment-menu-wrap" ref={menuRef}>
          <button
            className="comment-dots-btn icon-btn"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Comment options"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="comment-dropdown">
              <button
                className="comment-dropdown-item"
                onClick={() => { onEdit(comment); setMenuOpen(false); }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Edit
              </button>
              <button
                className="comment-dropdown-item comment-dropdown-delete"
                onClick={() => { onDelete(comment._id); setMenuOpen(false); }}
              >
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
  );
}

function SuggestedVideoItem({ video }) {
  const placeholder = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=320&h=180&fit=crop';
  return (
    <Link to={`/watch/${video._id}`} className="suggested-item">
      <div className="suggested-thumb">
        <img
          src={video.thumbnailUrl || placeholder}
          alt={video.title}
          onError={(e) => { e.target.src = placeholder; }}
        />
      </div>
      <div className="suggested-info">
        <p className="suggested-title">{video.title}</p>
        <p className="suggested-channel">{video.channelName}</p>
        <p className="suggested-meta">{formatViews(video.views)} views &bull; {timeAgo(video.uploadDate || video.createdAt)}</p>
      </div>
      <button className="suggested-dots icon-btn" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
    </Link>
  );
}

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const { mode } = useSidebar();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggested, setSuggested] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDescExpanded(false);
    setEditingComment(null);
    setCommentText('');

    api.get(`/videos/${id}`)
      .then(({ data }) => {
        setVideo(data);
        setLikeCount(data.likes?.length || 0);
        setDislikeCount(data.dislikes?.length || 0);
        if (user) {
          setUserLiked(data.likes?.includes(user._id));
          setUserDisliked(data.dislikes?.includes(user._id));
        }
      })
      .catch(() => setError('Video not found'))
      .finally(() => setLoading(false));

    api.get('/videos').then(({ data }) => {
      setSuggested(data.filter((v) => v._id !== id).slice(0, 20));
    }).catch(() => {});
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/auth');
    try {
      const { data } = await api.post(`/videos/${id}/like`);
      setLikeCount(data.likes);
      setDislikeCount(data.dislikes);
      setUserLiked((p) => !p);
      if (userDisliked) setUserDisliked(false);
    } catch {}
  };

  const handleDislike = async () => {
    if (!user) return navigate('/auth');
    try {
      const { data } = await api.post(`/videos/${id}/dislike`);
      setLikeCount(data.likes);
      setDislikeCount(data.dislikes);
      setUserDisliked((p) => !p);
      if (userLiked) setUserLiked(false);
    } catch {}
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const { data } = await api.post(`/videos/${id}/comments`, { text: commentText });
      setVideo((prev) => ({ ...prev, comments: [...(prev.comments || []), data] }));
      setCommentText('');
    } catch {}
    finally { setCommentLoading(false); }
  };

  const handleEditComment = async () => {
    if (!editText.trim() || !editingComment) return;
    try {
      const { data } = await api.put(`/videos/${id}/comments/${editingComment._id}`, { text: editText });
      setVideo((prev) => ({
        ...prev,
        comments: prev.comments.map((c) => (c._id === editingComment._id ? data : c)),
      }));
      setEditingComment(null);
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/videos/${id}/comments/${commentId}`);
      setVideo((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch {}
  };

  if (loading) {
    return (
      <div className="vp-page">
        <Header />
        <Sidebar />
        <div className="vp-loading"><div className="vp-spinner" /></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="vp-page">
        <Header />
        <Sidebar />
        <div className="vp-error">
          <p>{error || 'Something went wrong'}</p>
          <Link to="/" className="vp-back-btn">Go Home</Link>
        </div>
      </div>
    );
  }

  const comments = video.comments || [];
  const shortDesc = video.description?.slice(0, 150);
  const hasLongDesc = video.description?.length > 150;

  const sidebarClass = mode === 'expanded' ? 'vp-with-sidebar-expanded' : mode === 'mini' ? 'vp-with-sidebar-mini' : '';

  return (
    <div className="vp-page">
      <Header />
      <Sidebar />

      <div className={`vp-content ${sidebarClass}`}>
        {/* Left: player + info + comments */}
        <div className="vp-left">
          <div className="vp-player-wrap">
            {video.videoUrl ? (
              <video controls src={video.videoUrl} className="vp-video" />
            ) : (
              <div className="vp-no-video">
                <svg viewBox="0 0 24 24" fill="#555" width="64" height="64">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                <p>No video available</p>
              </div>
            )}
          </div>

          <h1 className="vp-title">{video.title}</h1>

          <div className="vp-meta-bar">
            <div className="vp-channel-row">
              <div className="vp-channel-avatar">
                {video.channelName?.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="vp-channel-name">
                  <Link to={`/channel/${video.channelId}`} className="vp-channel-link">
                    {video.channelName}
                  </Link>
                </p>
                <p className="vp-subs">{formatViews(video.views)} views</p>
              </div>
              <button className="vp-subscribe-btn">Subscribe</button>
            </div>

            <div className="vp-action-row">
              <div className="vp-like-group">
                <button
                  className={`vp-action-btn ${userLiked ? 'vp-btn-active' : ''}`}
                  onClick={handleLike}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                  </svg>
                  <span>{likeCount}</span>
                </button>
                <div className="vp-btn-divider" />
                <button
                  className={`vp-action-btn vp-btn-right ${userDisliked ? 'vp-btn-active' : ''}`}
                  onClick={handleDislike}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                  </svg>
                  <span>{dislikeCount}</span>
                </button>
              </div>

              <button className="vp-action-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                <span>Share</span>
              </button>

              <button className="vp-action-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                <span>Save</span>
              </button>

              <button className="vp-action-btn vp-dots-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="vp-description">
              <p className="vp-desc-views">
                {formatViews(video.views)} views &bull; {timeAgo(video.uploadDate || video.createdAt)}
              </p>
              <p className="vp-desc-text">
                {descExpanded ? video.description : shortDesc}
                {hasLongDesc && !descExpanded && '...'}
              </p>
              {hasLongDesc && (
                <button
                  className="vp-desc-toggle"
                  onClick={() => setDescExpanded((p) => !p)}
                >
                  {descExpanded ? 'Show less' : '...more'}
                </button>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="vp-comments-section">
            <div className="vp-comments-header">
              <h2>{comments.length} Comments</h2>
              <button className="vp-sort-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                </svg>
                Sort by
              </button>
            </div>

            {/* Add comment */}
            {user ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <div className="comment-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user.username?.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="comment-input-wrap">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="comment-input"
                  />
                  {commentText && (
                    <div className="comment-form-actions">
                      <button type="button" className="comment-cancel-btn" onClick={() => setCommentText('')}>
                        Cancel
                      </button>
                      <button type="submit" className="comment-submit-btn" disabled={!commentText.trim() || commentLoading}>
                        Comment
                      </button>
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <p className="comment-signin-note">
                <Link to="/auth">Sign in</Link> to leave a comment
              </p>
            )}

            {/* Edit inline form */}
            {editingComment && (
              <div className="comment-edit-box">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="comment-input"
                  autoFocus
                />
                <div className="comment-form-actions">
                  <button className="comment-cancel-btn" onClick={() => setEditingComment(null)}>Cancel</button>
                  <button
                    className="comment-submit-btn"
                    onClick={handleEditComment}
                    disabled={!editText.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Comment list */}
            <div className="comment-list">
              {comments.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  currentUser={user}
                  videoId={id}
                  onEdit={(comment) => { setEditingComment(comment); setEditText(comment.text); }}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: suggested videos */}
        <div className="vp-right">
          <div className="suggested-filters">
            {['All', 'Related', 'Watched', 'New to you', 'Trending', 'Music', 'Gaming'].map((f, i) => (
              <button key={f} className={`suggested-filter-btn${i === 0 ? ' suggested-filter-active' : ''}`}>{f}</button>
            ))}
          </div>
          <div className="suggested-list">
            {suggested.map((v) => (
              <SuggestedVideoItem key={v._id} video={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
