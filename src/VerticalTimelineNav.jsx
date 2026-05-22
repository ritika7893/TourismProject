import React, { useState, useEffect, useRef } from 'react';
import './VerticalTimelineNav.css';

const SECTIONS = [
  { id: 'hero-section', label: 'Top', icon: '🏔️' },
  { id: 'stats-section', label: 'Impact', icon: '📊' },
  { id: 'featured-adventures-section', label: 'Treks', icon: '🗺️' },
  { id: 'how-it-works-section', label: 'Process', icon: '⚙️' },
  { id: 'features-section', label: 'Features', icon: '⚡' },
  { id: 'testimonials-section', label: 'Reviews', icon: '💬' },
  { id: 'cta-section', label: 'Join', icon: '👋' },
  { id: 'footer-section', label: 'Info', icon: 'ℹ️' },
];

const VerticalTimelineNav = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observer = useRef(null);

  useEffect(() => {
    // 1. Setup Intersection Observer to detect current section
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle of the viewport
      threshold: 0,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.current.observe(element);
    });

    // 2. Track overall scroll progress for the vertical line
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (observer.current) observer.current.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Logic to determine node status
  const getStatus = (sectionId, index) => {
    const activeIndex = SECTIONS.findIndex(s => s.id === activeSection);
    if (sectionId === activeSection) return 'active';
    if (index < activeIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <nav className="timeline-nav-container">
      {/* Progress Track Background */}
      <div className="timeline-track">
        <div 
          className="timeline-progress-fill" 
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Interactive Nodes */}
      <div className="timeline-nodes">
        {SECTIONS.map((section, index) => {
          const status = getStatus(section.id, index);
          return (
            <div 
              key={section.id} 
              className={`node-wrapper ${status}`}
              onClick={() => scrollToSection(section.id)}
            >
              <div className="timeline-node">
                <span>{section.icon}</span>
              </div>
              <div className="node-tooltip">
                {section.label}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default VerticalTimelineNav;