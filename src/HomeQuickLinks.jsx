import React, { useState } from 'react';
import './HomeQuickLinks.css';

const HomeQuickLinks = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  return (
    <>
      <button className="quick-links-toggle" onClick={toggleMenu} aria-label="Toggle Quick Links">
        {isOpen ? '✕' : '☰'} Quick Links
      </button>
      <div className={`quick-links-menu ${isOpen ? 'active' : ''}`}>
        <div className="quick-links-header">
          <h3>Quick Navigation</h3>
          <button className="close-menu-btn" onClick={closeMenu} aria-label="Close Quick Links">✕</button>
        </div>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => scrollToSection(section.id)}
                className="quick-link-item"
              >
                {section.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {isOpen && <div className="quick-links-overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default HomeQuickLinks;