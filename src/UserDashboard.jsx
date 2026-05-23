import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import DashboardTopNav from './DashboardTopNav.jsx';
import BookingForm from './BookingForm.jsx';
import { BASE_URL } from './api/config.jsx';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, accessToken } = useAuth();
  const [view, setView] = useState('summary'); // summary, all-tracks, booking
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showHotelsModal, setShowHotelsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaces();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (view === 'summary') fetchBookings();
  }, [view]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/places/`);
      const result = await response.json();
      if (result.status) {
        setPlaces(result.data);
      }
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/booking/`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const result = await response.json();
      if (result.status) {
        setBookings(result.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHotels = (place) => {
    setSelectedPlace(place);
    setShowHotelsModal(true);
  };

  const handleBookTrack = (place) => {
    setSelectedPlace(place);
    setView('booking');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  return (
    <div className="dashboard-layout">
      <DashboardTopNav variant="user" onViewChange={setView} />

      <div className="dashboard-body">
        <div className="role-dashboard">
          {view === 'summary' && (
            <div className="bookings-view">
              <h2>My Booked Expeditions</h2>
              {loading && bookings.length === 0 ? <p>Loading your adventures...</p> : (
                <div className="dashboard-cards">
                  {bookings.length > 0 ? (
                    bookings.map((b) => {
                      const trekInfo = places.find(p => Number(p.id) === Number(b.place));
                      const isPending = b.status === 'pending';
                      
                      return (
                      <div className="dash-card user-card animate-pop-in" key={b.id} style={{ borderLeft: `5px solid ${isPending ? '#f59e0b' : '#10b981'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ margin: '0' }}>{b.place_name}</h3>
                            <p style={{ margin: '2px 0 10px 0', color: '#64748b', fontWeight: '600', fontSize: '0.95rem' }}>{b.hotel_name}</p>
                          </div>
                          <span style={{ 
                            backgroundColor: isPending ? '#fffbeb' : '#ecfdf5', 
                            color: isPending ? '#b45309' : '#047857', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' 
                          }}>
                            {isPending ? '🕒 Booking in Progress' : '✓ Booked'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: '5px 0' }}><strong>Total Group:</strong> {b.total_people} People</p>
                        <p style={{ fontSize: '0.9rem', margin: '5px 0' }}><strong>Expedition Cost:</strong> ₹{b.total_price}</p>
                        <p style={{ fontSize: '0.9rem', margin: '5px 0', color: '#10b981', fontWeight: '600' }}>
                          <strong>Scheduled:</strong> {trekInfo?.booking_date ? new Date(trekInfo.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} 
                          {' @ '} 
                          {trekInfo?.booking_time ? (
                            trekInfo.booking_time.includes('T') ? new Date(trekInfo.booking_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : trekInfo.booking_time.slice(0, 5)
                          ) : 'TBD'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '10px' }}>Reference ID: #{b.id}</p>
                        <button onClick={() => handleViewDetails(b)} className="btn btn-outline-primary" style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem', padding: '8px' }}>
                          View Details
                        </button>
                      </div>
                      );
                    })
                  ) : (
                    <div className="dash-card user-card" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                      <p>You haven't booked any treks yet.</p>
                      <button onClick={() => setView('all-tracks')} className="btn btn-primary" style={{ marginTop: '15px' }}>Start an Adventure</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {view === 'all-tracks' && (
            <div className="places-list-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Available Tracks</h2>
                <button onClick={() => setView('summary')} className="btn btn-back">← Back to Summary</button>
              </div>
              {loading ? <p>Loading tracks...</p> : (
                <div className="dashboard-cards">
                  {places.map((place) => (
                    <div key={place.id} className="dash-card user-card animate-pop-in" style={{ padding: '0', overflow: 'hidden' }}>
                      <img 
                        src={place.image?.startsWith('http') ? place.image : `${BASE_URL}${place.image}`} 
                        alt={place.place_name} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0 }}>{place.place_name}</h3>
                          <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>⭐ {place.rating}</span>
                        </div>
                        <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#64748b' }}>{place.description}</p>
                        <p style={{ fontWeight: '700' }}>Price: ₹{place.one_person_price}</p>
                        <p style={{ fontSize: '0.85rem', color: '#2563eb', margin: '5px 0' }}>
                          🕒 Next departure: {place.booking_date ? new Date(place.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} 
                          {' at '} 
                          {place.booking_time ? (
                            place.booking_time.includes('T') ? new Date(place.booking_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : place.booking_time.slice(0, 5)
                          ) : 'TBD'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button onClick={() => handleViewHotels(place)} className="btn btn-outline-primary" style={{ flex: 1, padding: '10px' }}>🏨 View Hotels</button>
                          <button onClick={() => handleBookTrack(place)} className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>🎟️ Book Track</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'booking' && (
            <BookingForm 
              place={selectedPlace} 
              onBack={() => setView('all-tracks')} 
              onSuccess={() => {
                setView('summary');
                alert("Booking successful!");
                fetchBookings();
              }}
            />
          )}
        </div>
      </div>

      {/* Hotels Modal */}
      {showHotelsModal && selectedPlace && (
        <div className="modal-overlay" onClick={() => setShowHotelsModal(false)}>
          <div className="modal-content animate-pop-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Hotels in {selectedPlace.place_name}</h2>
              <button className="close-btn" onClick={() => setShowHotelsModal(false)}>✕</button>
            </div>
            <div className="dashboard-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
              {selectedPlace.hotels && selectedPlace.hotels.length > 0 ? (
                selectedPlace.hotels.map(hotel => (
                  <div key={hotel.id} className="dash-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img 
                      src={hotel.hotel_image?.startsWith('http') ? hotel.hotel_image : `${BASE_URL}${hotel.hotel_image}`} 
                      alt={hotel.hotel_name} 
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{hotel.hotel_name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 5px 0' }}>₹{hotel.hotel_price} / night</p>
                      <span style={{ fontSize: '0.8rem' }}>⭐ {hotel.hotel_rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hotels found for this track.</p>
              )}
            </div>
            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => { setShowHotelsModal(false); handleBookTrack(selectedPlace); }}>
                Book this Track Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content animate-pop-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 style={{ color: '#1e293b' }}>🎒 Expedition Details</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div className="modal-body" style={{ marginTop: '20px' }}>
              <section style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#2e7d5f', fontSize: '1.1rem', borderBottom: '2px solid #f0fdf4', paddingBottom: '8px', marginBottom: '12px' }}>
                  📍 About the {selectedBooking.place_name} Track
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {places.find(p => Number(p.id) === Number(selectedBooking.place))?.description || 'Information about this track is being updated by the guides.'}
                </p>
              </section>

              <section>
                <h3 style={{ color: '#2e7d5f', fontSize: '1.1rem', borderBottom: '2px solid #f0fdf4', paddingBottom: '8px', marginBottom: '12px' }}>
                  👥 Expedition Members
                </h3>
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>{selectedBooking.person_name} (Lead)</span>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>PRIMARY CONTACT</span>
                  </div>
                  
                  {(() => {
                    let members = [];
                    try {
                      members = typeof selectedBooking.members === 'string' 
                        ? JSON.parse(selectedBooking.members) 
                        : (selectedBooking.members || []);
                    } catch (e) {
                      console.error("Failed to parse members:", e);
                    }

                    return members.length > 0 ? (
                      members.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx === members.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                          <span style={{ color: '#334155', fontWeight: '500' }}>{m.member_name}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>ID Proof Verified</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>Solo adventure: No additional members registered.</p>
                    );
                  })()}
                </div>
              </section>

              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                <button className="btn btn-primary" onClick={() => setShowDetailsModal(false)}>Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
