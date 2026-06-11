import { Link } from 'react-router-dom';
import './VideoCard.css';

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export default function VideoCard({ video }) {
  const thumbnailPlaceholder =
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=640&h=360&fit=crop';

  return (
    <Link to={`/watch/${video._id}`} className="video-card">
      <div className="video-thumbnail">
        <img
          src={video.thumbnailUrl || thumbnailPlaceholder}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = thumbnailPlaceholder;
          }}
        />
      </div>
      <div className="video-info">
        <div className="channel-avatar-small">
          <span>{video.channelName?.slice(0, 1).toUpperCase()}</span>
        </div>
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-channel">{video.channelName}</p>
          <p className="video-meta">
            {formatViews(video.views)} views &bull; {timeAgo(video.uploadDate || video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
