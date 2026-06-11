import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext.jsx';
import './Sidebar.css';

//Sidebar defined here
const mainNav = [
  {
    label: 'Home',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: 'Shorts',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.56-3.22 1.6-5.06s-3.22-2.56-5.06-1.6L6 6.94c-1.29.68-2.07 2.01-2 3.44.07 1.43.97 2.67 2.31 3.22l1.2.5L6 14.94c-1.84.96-2.56 3.22-1.6 5.06.96 1.84 3.22 2.56 5.06 1.6l8.54-4.54c1.29-.68 2.07-2.01 2-3.44-.07-1.43-.97-2.67-2.23-3.3zM10 14.45v-4.9l4.45 2.45L10 14.45z" />
      </svg>
    ),
  },
  {
    label: 'Subscriptions',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 18v-2h4v2h-4zm-4-4v-2h12v2H6zm-2-4V8h16v2H4z" />
      </svg>
    ),
  },
  {
    label: 'You',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
];

const exploreItems = [
  {
    label: 'Trending',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 6.5l-5 5-3-3L4 13l1.5 1.5 3-3 3 3L17 9l1.5 1.5L22 7l-5.5-.5z" />
      </svg>
    ),
  },
  {
    label: 'Shopping',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.42 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Music',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    ),
  },
  {
    label: 'Movies',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    ),
  },
  {
    label: 'Live',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    ),
  },
  {
    label: 'Gaming',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5S14.67 11 15.5 11s1.5.67 1.5 1.5S16.33 14 15.5 14zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5S19.33 11 18.5 11z" />
      </svg>
    ),
  },
  {
    label: 'News',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
      </svg>
    ),
  },
  {
    label: 'Sports',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.95 7.95 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { mode, close } = useSidebar();
  const location = useLocation();

  const isExpanded = mode === 'expanded';
  const isMobileOpen = mode === 'mobile-open';
  const isMini = mode === 'mini';

  const showOverlay = isMobileOpen;

  return (
    <>
      {showOverlay && (
        <div className="sidebar-overlay" onClick={close} />
      )}
      <aside
        className={[
          'sidebar',
          isExpanded ? 'sidebar-expanded' : '',
          isMini ? 'sidebar-mini' : '',
          isMobileOpen ? 'sidebar-mobile-open' : '',
          !isExpanded && !isMini && !isMobileOpen ? 'sidebar-hidden' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <nav className="sidebar-nav">
          {/* Main nav */}
          <div className="sidebar-section">
            {mainNav.map((item) => {
              const active = location.pathname === item.path && item.label === 'Home';
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
                  title={isMini ? item.label : undefined}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Only show these in expanded mode */}
          {(isExpanded || isMobileOpen) && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-section">
                <p className="sidebar-heading">Explore</p>
                {exploreItems.map((item) => (
                  <Link key={item.label} to={item.path} className="sidebar-item">
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Mini: show divider + explore icons */}
          {isMini && (
            <>
              <div className="sidebar-divider" />
              {exploreItems.slice(0, 4).map((item) => (
                <Link key={item.label} to={item.path} className="sidebar-item" title={item.label}>
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
