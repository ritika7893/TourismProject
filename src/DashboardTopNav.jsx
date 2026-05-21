import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './DashboardTopNav.css';

const DashboardTopNav = ({ variant = 'user' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = variant === 'admin';

  return (
    <div className={`dashboard-topnav ${isAdmin ? 'admin-topnav' : 'user-topnav'}`}>
      <div className="topnav-brand">
        <h3>{isAdmin ? 'Admin Panel' : 'User Dashboard'}</h3>
      </div>

      {/* desktop nav links */}
      <nav className="topnav-links">
        {isAdmin ? (
          <>
            <a href="#" className="topnav-link">Users</a>
            <a href="#" className="topnav-link">Settings</a>
            <a href="#" className="topnav-link">Reports</a>
          </>
        ) : (
          <>
            <a href="#" className="topnav-link">Adventures</a>
            <a href="#" className="topnav-link">Stats</a>
            <a href="#" className="topnav-link">Actions</a>
          </>
        )}
      </nav>

      <div className="topnav-user-info">
        <span className="user-id">
          {isAdmin ? 'Admin' : 'Account'}: {user?.mobile_number}
        </span>
        <button className="dashboard-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardTopNav;
