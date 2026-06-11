import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import api from '../api/axios.js';
import './Home.css';

//Home page defined here
export default function Home() {
  const { mode } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== search) {
      setSearch(urlSearch);
      if (urlSearch) setCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchVideos();
  }, [category, search]);

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await api.get('/videos', { params });
      setVideos(data);
    } catch {
      setError('Failed to load videos. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    setCategory('All');
    if (!q.trim()) {
      // Clear search completely
      setSearch('');
      setSearchParams({});
    } else {
      // Set search query
      setSearch(q);
      setSearchParams({ search: q });
    }
  };

  const mainClass = [
    'home-main',
    mode === 'expanded' ? 'main-expanded' : '',
    mode === 'mini' ? 'main-mini' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="home-layout">
      <Header onSearch={handleSearch} searchQuery={search} />
      <Sidebar />

      <main className={mainClass}>
        <FilterBar
          active={category}
          onChange={(cat) => {
            setCategory(cat);
            if (cat !== 'All') {
              setSearch('');
              setSearchParams({});
            }
          }}
        />

        <div className="video-grid-container">
          {loading && (
            <div className="loading-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-info">
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-sub" />
                    <div className="skeleton-line skeleton-meta" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchVideos} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="#555" width="64" height="64">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
              </svg>
              <p>No videos found{search ? ` for "${search}"` : ''}</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
