import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './DashboardTopNav.css';

/* ── Hamburger icon (3 bars) ── */
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ── 'X' close icon ── */
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6"  y1="6"  x2="18" y2="18" />
    <line x1="6"  y1="18" x2="18" y2="6"  />
  </svg>
);

const DashboardTopNav = ({ variant = 'user' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin = variant === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Nav links defined per role */
  const navItems = isAdmin
    ? [
        { label: 'Users',     href: '#users'     },
        { label: 'Settings',  href: '#settings'  },
        { label: 'Reports',   href: '#reports'   },
      ]
    : [
        { label: 'Adventures', href: '#adventures' },
        { label: 'Stats',      href: '#stats'      },
        { label: 'Actions',    href: '#actions'    },
      ];

  /* Close drawer after navigation */
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setDrawerOpen(false);
    // navigate(href);   // uncomment when routes exist
  };

  return (
    <>
      <header className={`dashboard-topnav ${isAdmin ? 'admin-topnav' : 'user-topnav'}`}>
        <div className="topnav-brand">
          <h3>{isAdmin ? 'Admin Panel' : 'User Dashboard'}</h3>
        </div>

        {/* Desktop inline nav — hidden on ≤768px */}
        <nav className="topnav-links" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="topnav-link" onClick={(e) => handleLinkClick(e, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topnav-user-info">
          <span className="user-id">
            {isAdmin ? 'Admin' : 'Account'}: {user?.user_id}
          </span>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>

          {/* ── Hamburger — visible on ≤768px ── */}
          <button
            className="hamburger-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((prev) => !prev)}
          >
            {drawerOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {/* ── Mobile / Tablet side drawer ── */}
      <div className={`drawer-overlay ${drawerOpen ? 'is-open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
        <div className="drawer-header">
          <span>{isAdmin ? 'Admin Panel' : 'User Dashboard'}</span>
          <button
            className="drawer-close"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="drawer-body">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="drawer-link"
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="drawer-footer">
          <span className="drawer-account-label">
            {isAdmin ? 'Admin' : 'Account'}: {user?.user_id}
          </span>
          <button className="drawer-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardTopNav;
