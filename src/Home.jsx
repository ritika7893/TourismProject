import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './Home.css';
import HomeQuickLinks from './HomeQuickLinks.jsx'; // Import the new component

const Home = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState('...'); // Initialize with a placeholder
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchUserCount = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/user-count/');
      const data = await response.json();
      
      // Your API returns 'user_count', so we check for that specifically
      const countValue = data.user_count !== undefined ? data.user_count : data.count;
      if (response.ok && countValue !== undefined) {
        setUserCount(countValue.toLocaleString()); // Format number with commas
      } else {
        const errorMsg = data.message || data.detail || data.error || 'Unknown error';
        console.error('Failed to fetch user count:', errorMsg, data);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserCount();
  }, [fetchUserCount]);

  const sections = [
    { id: 'hero-section', name: 'Top' },
    { id: 'stats-section', name: 'Our Impact' },
    { id: 'featured-adventures-section', name: 'Popular Treks' },
    { id: 'how-it-works-section', name: 'How It Works' },
    { id: 'features-section', name: 'Features' },
    { id: 'testimonials-section', name: 'Testimonials' },
    { id: 'cta-section', name: 'Join Us' },
    { id: 'footer-section', name: 'Info' },
  ];

  return (
    <div className="home-wrapper">
      <HomeQuickLinks sections={sections} />
      {/* Hero Section */}
      <header id="hero-section" className="hero-section container">
        <div className="hero-content reveal-fade-left">
          <div className="hero-badge animate-pop-in jumping-badge">
            <span className="balloon balloon-1">🎈</span> {/* Visual elements */}
            <span className="balloon balloon-2">🎈</span> {/* Visual elements */}
            <span className="balloon balloon-3">🎈</span> {/* Visual elements */}
            🏔️ {userCount}+ Active Adventurers
          </div>
          <h1 className="hero-title animate-pop-in">
            Explore Fearlessly. <span className="text-primary">Track Everywhere.</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate adventure tracking platform for hiking, camping, and trekking 
            across Himalayas and remote forests. Real-time GPS, offline mapping, and safety alerts 
            for every adventure seeker.
          </p>
          <div className="hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">View My Trails</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary btn-lg">Explore Demo</Link>
              </>
            )}
          </div>
        </div> 
        <div className="hero-image-container">
          {heroImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Adventure Scene ${index + 1}`} 
              className={`hero-dashboard-img ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </header>

      {/* Stats Section */}
      <section id="stats-section" className="stats-bar">
        <div className="stat-item">
          <h3>50k+</h3>
          <p>Miles Tracked</p>
        </div>
        <div className="stat-item">
          <h3>120+</h3>
          <p>Mountains Covered</p>
        </div>
        <div className="stat-item">
          <h3>15</h3>
          <p>Countries</p>
        </div>
        <div className="stat-item">
          <h3>99.8%</h3>
          <p>GPS Accuracy</p>
        </div>
      </section>

      {/* Featured Adventures */}
      <section id="featured-adventures-section" className="featured-adventures container">
        <div className="section-header">
          <h2>Popular Treks & Routes</h2>
          <p>Discover trails tracked by thousands of adventurers</p>
        </div>
        <div className="adventures-grid">
          <div className="adventure-card">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=500" alt="Himalayan Trek" />
            <div className="adventure-content">
              <h3>Himalayas Grand Trek</h3>
              <p className="difficulty">Difficulty: Hard</p>
              <p>7-day expedition through snow-capped peaks with 12,450+ tracked routes</p>
              <span className="rating">⭐⭐⭐⭐⭐ 4.8/5</span>
            </div>
          </div>
          <div className="adventure-card">
            <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=500" alt="Forest Trek" />
            <div className="adventure-content">
              <h3>Forest Wilderness Trail</h3>
              <p className="difficulty">Difficulty: Medium</p>
              <p>Multi-day camping through dense forests with real-time safety tracking</p>
              <span className="rating">⭐⭐⭐⭐⭐ 4.7/5</span>
            </div>
          </div>
          <div className="adventure-card">
            <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=500" alt="Summit Trek" />
            <div className="adventure-content">
              <h3>Alpine Summit Adventure</h3>
              <p className="difficulty">Difficulty: Expert</p>
              <p>Challenge yourself on high-altitude peaks with expert guidance</p>
              <span className="rating">⭐⭐⭐⭐⭐ 4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="how-it-works container">
        <div className="section-header">
          <h2>Start Your Adventure Journey</h2>
          <p>Track your way through forests and mountains in simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">01</div>
            <h3>🌐 Sign Up & Setup</h3>
            <p>Create your account on our website, configure your preferences, and sync your GPS data.</p>
          </div>
          <div className="step-item">
            <div className="step-number">02</div>
            <h3>🗺️ Choose Your Trail</h3>
            <p>Pick from hundreds of curated routes or create your own custom adventure path.</p>
          </div>
          <div className="step-item">
            <div className="step-number">03</div>
            <h3>🏔️ Track & Share</h3>
            <p>Trek with real-time tracking, offline maps, and instant safety alerts for your group.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features-section container">
        <div className="section-header">
          <h2>Adventure-Ready Features</h2>
          <p>Everything you need for safe and memorable treks</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛰️</div>
            <h3>Precise GPS Tracking</h3>
            <p>Meter-level accuracy even in remote mountain areas with multi-satellite reception.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>Offline Maps</h3>
            <p>Download terrain maps for zero-signal zones and navigate confidently anywhere.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🆘</div>
            <h3>SOS & Safety Alerts</h3>
            <p>One-tap emergency alerts and geofence notifications for your adventure group.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Trip Analytics</h3>
            <p>Detailed stats on distance, elevation, speed, and time for every trek completed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Group Tracking</h3>
            <p>Real-time location sharing with friends and family for group safety and coordination.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏅</div>
            <h3>Achievement Badges</h3>
            <p>Unlock badges, share your conquests, and connect with the adventure community.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="testimonials-section container">
        <div className="section-header">
          <h2>Trusted by Adventure Seekers</h2>
          <p>Real stories from real trekkers</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">"This website saved my trek! The detailed web mapping and SOS features gave me confidence in remote areas. Highly recommended!"</p>
            <p className="testimonial-author">- Sarah M., Himalayan Trekker</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"Best tracking platform for group camping trips. We stay connected and safe with real-time browser-based location sharing."</p>
            <p className="testimonial-author">- Raj K., Adventure Guide</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"The detailed stats and elevation tracking help me plan better routes. Love this platform!"</p>
            <p className="testimonial-author">- Priya D., Outdoor Enthusiast</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="cta-section">
        <div className="cta-content container">
          <h2>Ready to Explore?</h2>
          <p>Join thousands of adventurers tracking their journeys across mountains and forests</p>
        </div>
      </section>

      {/* Trust Section */}
      <footer id="footer-section" className="home-footer">
        <p>&copy; 2024 Adventure Tracker. Explore Responsibly.</p>
        <div className="footer-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/">Safety Guidelines</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;