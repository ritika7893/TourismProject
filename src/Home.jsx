import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { BASE_URL } from './api/config.jsx';
import './Home.css';
import HomeQuickLinks from './HomeQuickLinks.jsx'; // Import the new component

const Home = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState('...'); // Initialize with a placeholder
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalHotels, setModalHotels] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeBookingPlaceName, setActiveBookingPlaceName] = useState('');
  const [activePlaceName, setActivePlaceName] = useState('');
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  const scrollRef = useRef(null);

  // Auto-scroll logic for horizontal scroller
  useEffect(() => {
    let interval;
    if (isAutoScrollActive && places.length > 0 && scrollRef.current) {
      const setTotalWidth = places.length * 320; // 300px card + 20px gap

      interval = setInterval(() => {
        if (scrollRef.current) {
          // Only auto-scroll if the container is not being hovered
          if (!scrollRef.current.matches(':hover')) {
            scrollRef.current.scrollLeft += 1;

            // Seamless loop: once we've scrolled past the middle sets, 
            // jump back by one set width to keep the runway long.
            if (scrollRef.current.scrollLeft >= setTotalWidth * 10) {
              scrollRef.current.scrollLeft -= setTotalWidth;
            }
          }
        }
      }, 30); // Adjust speed here (lower is faster)
    }
    return () => clearInterval(interval);
  }, [places, isAutoScrollActive]);

  // Set initial scroll position to the middle to allow bidirectional infinite scrolling
  useEffect(() => {
    if (places.length > 0 && scrollRef.current) {
      // Start at the 8th set for maximum runway in both directions
      scrollRef.current.scrollLeft = places.length * 320 * 8;
    }
  }, [places]);

  const handleManualScroll = (direction) => {
    if (scrollRef.current && places.length > 0) {
      setIsAutoScrollActive(false); // Stop moving cards automatically when icons are clicked
      
      const cardTotalWidth = 320; // 300px card width + 20px gap
      const setTotalWidth = places.length * cardTotalWidth;
      let currentScroll = scrollRef.current.scrollLeft;

      // Normalization: shift current position into a stable middle zone instantly.
      // This jump is invisible but ensures we never hit the physical scroll end.
      const normalizedScroll = (currentScroll % setTotalWidth) + setTotalWidth * 8;
      scrollRef.current.scrollLeft = normalizedScroll;
      
      let targetScroll;
      if (direction === 'right') {
        targetScroll = Math.floor(normalizedScroll / cardTotalWidth) * cardTotalWidth + cardTotalWidth;
      } else {
        targetScroll = Math.ceil(normalizedScroll / cardTotalWidth) * cardTotalWidth - cardTotalWidth;
      }

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

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
      const response = await fetch(`${BASE_URL}/user-count/`);
      const data = await response.json();
      
      // Your API returns 'user_count', so we check for that specifically
      const countValue = data.user_count !== undefined ? data.user_count : data.count;
      if (response.ok && countValue !== undefined) {
        setUserCount((countValue - 1).toLocaleString()); // Show total count - 1 as requested
      } else {
        const errorMsg = data.message || data.detail || data.error || 'Unknown error';
        console.error('Failed to fetch user count:', errorMsg, data);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }, []);

  const fetchPlaces = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/places/`);
      const data = await response.json();
      if (data.status) {
        setPlaces(data.data);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserCount();
    fetchPlaces();
  }, [fetchUserCount, fetchPlaces]);

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

  const openHotelsModal = (place) => {
    setModalHotels(place.hotels || []);
    setActivePlaceName(place.place_name);
    setShowModal(true);
  };
  
  const openBookingModal = (placeName) => {
    setActiveBookingPlaceName(placeName);
    setShowBookingModal(true);
  };

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
        <style>{`
          .adventures-scroll-wrapper::-webkit-scrollbar {
            display: none;
          }
          .scroll-control-btn {
            background: white;
            border: 2px solid #2563eb;
            color: #2563eb;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
            z-index: 5;
          }
          .scroll-control-btn:hover {
            background: #2563eb;
            color: white;
            transform: scale(1.1);
          }
        `}</style>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ margin: 0 }}>Popular Treks & Routes</h2>
          <p style={{ margin: '8px 0 0 0' }}>Discover trails tracked by thousands of adventurers</p>
        </div>

        <div className="scroller-relative-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button 
            className="scroll-control-btn" 
            onClick={() => handleManualScroll('left')} 
            aria-label="Previous"
            style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >❮</button>

          <div className="adventures-scroll-wrapper" ref={scrollRef} style={{ 
            overflowX: 'auto', 
          paddingBottom: '20px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
            width: '100%'
        }}>
          <div className="adventures-grid" style={{ 
            display: 'flex', 
            gap: '20px', 
            width: 'max-content',
            padding: '10px',
          }}>
            {/* Repeat the list 20 times. This creates a massive scrollable track 
                ensuring that the jump point is reachable even on high-resolution 
                monitors with very few items. */}
            {[...Array(20)].flatMap(() => places).map((place, index) => (
              <div className="adventure-card" key={`${place.id}-${index}`} style={{ width: '300px', flexShrink: 0 }}>
                <img 
                  src={place.image?.startsWith('http') ? place.image : `${BASE_URL}${place.image}`} 
                  alt={place.place_name} 
                />
                <div className="adventure-content">
                  <h3>{place.place_name}</h3>
                  <p className="difficulty">Stay: {place.number_of_days_stay} Days</p>
                  <p style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 'bold', margin: '2px 0' }}>
                    📅 {place.booking_date ? new Date(place.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} 
                    {' @ '} 
                    {place.booking_time ? (
                      place.booking_time.includes('T') ? new Date(place.booking_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : place.booking_time.slice(0, 5)
                    ) : 'TBD'}
                  </p>
                  <p style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{place.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span className="rating">⭐ {place.rating}/5</span>
                    <span className="price" style={{ fontWeight: 'bold', color: '#2563eb' }}>₹{place.one_person_price} / person</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        fontSize: '0.9rem', 
                        border: '2px solid #2563eb', 
                        backgroundColor: '#f0f7ff', 
                        color: '#2563eb', 
                        borderRadius: '8px', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => openHotelsModal(place)}
                    >
                      🏨 View Hotels
                    </button>
                    <button 
                      style={{ flex: 1, padding: '10px', fontSize: '0.9rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                      onClick={() => openBookingModal(place.place_name)}
                    >Book Now</button>
                  </div>
                </div>
              </div>
            ))}
            {places.length === 0 && <p>Discovering destinations for you...</p>}
          </div>
        </div>

          <button 
            className="scroll-control-btn" 
            onClick={() => handleManualScroll('right')} 
            aria-label="Next"
            style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >❯</button>
        </div>
      </section>

      {/* Hotels Modal */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div className="modal-content animate-pop-in" style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '15px',
            maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }} onClick={e => e.stopPropagation()}>
            <button style={{
              position: 'absolute', top: '15px', right: '20px', background: 'none',
              border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'
            }} onClick={() => setShowModal(false)}>✕</button>
            
            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Stay options in {activePlaceName}</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {modalHotels.map(hotel => (
                <div key={hotel.id} style={{ 
                  border: '1px solid #eee', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}>
                  <img 
                    src={hotel.hotel_image?.startsWith('http') ? hotel.hotel_image : `http://127.0.0.1:8000${hotel.hotel_image}`} 
                    alt={hotel.hotel_name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{hotel.hotel_name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>{hotel.hotel_description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⭐ {hotel.hotel_rating}</span>
                      <span style={{ fontWeight: '600' }}>₹{hotel.hotel_price}</span>
                    </div>
                  </div>
                </div>
              ))}
              {modalHotels.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>No hotels registered for this destination yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setShowBookingModal(false)}>
          <div className="modal-content animate-pop-in" style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '15px',
            maxWidth: '450px', width: '100%', position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <button style={{
              position: 'absolute', top: '15px', right: '20px', background: 'none',
              border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'
            }} onClick={() => setShowBookingModal(false)}>✕</button>

            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🧳</div>
            <h2 style={{ marginBottom: '10px', color: '#1e293b', fontWeight: '800' }}>Ready for {activeBookingPlaceName}?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#64748b', lineHeight: '1.5' }}>
              You need to be part of our explorer community to book this trip. Please <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>login</Link> or <Link to="/register" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>register</Link> to continue.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" style={{ 
                padding: '14px', 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '700',
                fontSize: '1.1rem'
              }} onClick={() => setShowBookingModal(false)}>Login to Book</Link>
              <Link to="/register" style={{ 
                padding: '14px', 
                border: '2px solid #2563eb', 
                color: '#2563eb', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '700',
                fontSize: '1.1rem',
                backgroundColor: '#ffffff'
              }} onClick={() => setShowBookingModal(false)}>Register Now</Link>
            </div>
          </div>
        </div>
      )}

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