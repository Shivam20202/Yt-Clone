import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
import './Header.css';

//Navbar defined here
export default function Header({ onSearch, searchQuery = '' }) {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchQuery);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-search as user types
    if (onSearch && value.trim()) {
      onSearch(value);
    } else if (onSearch && !value.trim()) {
      // Clear search to show all videos
      onSearch('');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    setQuery('');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || '';
  const hasChannel = user?.channels?.length > 0;
  const channelId = hasChannel
    ? user.channels[0]?._id || user.channels[0]
    : null;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="icon-btn" onClick={toggle} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <svg viewBox="0 0 28 20" className="logo-icon">
              <path d="M27.9727 3.12324C27.6435 1.89288 26.6768 0.926297 25.4464 0.597051C23.2056 0 14.3407 0 14.3407 0C14.3407 0 5.47581 0 3.23494 0.597051C2.00481 0.926297 1.03812 1.89288 0.708947 3.12324C0.111938 5.36412 0.111938 10.0392 0.111938 10.0392C0.111938 10.0392 0.111938 14.7142 0.708947 16.9551C1.03812 18.1855 2.00481 19.0739 3.23494 19.4031C5.47581 20 14.3407 20 14.3407 20C14.3407 20 23.2056 20 25.4464 19.4031C26.6768 19.0739 27.6435 18.1855 27.9727 16.9551C28.5697 14.7142 28.5697 10.0392 28.5697 10.0392C28.5697 10.0392 28.5697 5.36412 27.9727 3.12324Z" fill="#FF0000" />
              <path d="M11.4128 14.2984L18.8887 10.0391L11.4128 5.77991V14.2984Z" fill="white" />
            </svg>
            <span className="logo-text">YouTube</span>
          </Link>
        </div>

        <form className="header-search" onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleInputChange}
              aria-label="Search"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
          <button type="button" className="mic-btn" aria-label="Search with voice">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </form>

        <div className="header-right">
          {user ? (
            <>
              {hasChannel ? (
                <Link to={`/channel/${channelId}`} className="create-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  <span>View channel</span>
                </Link>
              ) : (
                <Link to="/channel/create" className="create-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <span>Create</span>
                </Link>
              )}

              <button className="icon-btn" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </button>

              <div className="user-menu" ref={dropRef}>
                <button
                  className="avatar-btn"
                  onClick={() => setDropdownOpen((p) => !p)}
                  aria-label="Account"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="avatar-img" />
                  ) : (
                    <span className="avatar-initials">{initials}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="dropdown">
                    <div className="dropdown-user-row">
                      <div className="dropdown-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div>
                        <p className="dropdown-name">{user.username}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    {hasChannel ? (
                      <Link
                        to={`/channel/${channelId}`}
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                        Your channel
                      </Link>
                    ) : (
                      <Link
                        to="/channel/create"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Create a channel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth" className="sign-in-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
