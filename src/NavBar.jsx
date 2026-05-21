import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import RegistrationForm from './RegistrationForm';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo and Text */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="logo-icon">🚀</div>
          <span className="logo-text">ReactApp</span>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </div>

        {/* Right: Navigation Links */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
          </li>
          <li className="nav-item">
            <RegistrationForm onTrigger={closeMenu} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;