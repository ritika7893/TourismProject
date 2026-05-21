import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './DashboardTopNav.css';

const DashboardTopNav = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-topnav">
      <div className="topnav-brand">
        <h3>User Dashboard</h3>
      </div>
      <div className="topnav-user-info">
        <span className="user-id">Account: {user?.mobile_number}</span>
        <button className="dashboard-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardTopNav;