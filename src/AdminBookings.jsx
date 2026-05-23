import React from 'react';
import { BASE_URL } from './api/config.jsx';

const AdminBookings = ({ bookings, places, onBack, accessToken, onRefresh }) => {

  const handleStatusUpdate = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
    if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

    try {
      const response = await fetch(`${BASE_URL}/booking/${bookingId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to update status. Please ensure the backend supports PUT for status changes.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="admin-bookings-view animate-pop-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>All Expedition Reservations</h2>
        </div>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>← Back to Overview</button>
      </div>

      <div className="dashboard-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {bookings.length > 0 ? (
          bookings.map((b) => {
            const trekInfo = places.find(p => Number(p.id) === Number(b.place));
            const isPending = b.status === 'pending';
            
            return (
              <div className="dash-card admin-card animate-pop-in" key={b.id} style={{ borderLeft: `5px solid ${isPending ? '#f59e0b' : '#10b981'}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#1e293b' }}>{b.place_name}</h3>
                    <p style={{ margin: '2px 0 4px 0', color: '#64748b', fontWeight: '600', fontSize: '0.95rem' }}>{b.hotel_name}</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Booking ID: #{b.id}</span>
                  </div>
                  <span style={{ 
                    backgroundColor: isPending ? '#fffbeb' : '#ecfdf5', 
                    color: isPending ? '#b45309' : '#047857', 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase'
                  }}>
                    {isPending ? '🕒 Pending' : '✓ Confirmed'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>👤</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{b.person_name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>User ID: {b.user_id}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>👥</span>
                    <span style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Group Size:</strong> {b.total_people} Members</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>💰</span>
                    <span style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Total Price:</strong> ₹{b.total_price}</span>
                  </div>

                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b' }}>Trek Schedule:</span>
                      <span style={{ fontWeight: '600', color: '#2563eb' }}>
                        {trekInfo?.booking_date ? new Date(trekInfo.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} 
                        {' @ '} 
                        {trekInfo?.booking_time ? (trekInfo.booking_time.includes('T') ? new Date(trekInfo.booking_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : trekInfo.booking_time.slice(0, 5)) : 'TBD'}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleStatusUpdate(b.id, b.status)}
                    className="btn"
                    style={{ 
                      marginTop: '15px', 
                      backgroundColor: isPending ? '#10b981' : '#f1f5f9',
                      color: isPending ? 'white' : '#475569',
                      border: isPending ? 'none' : '1px solid #cbd5e1'
                    }}
                  >
                    {isPending ? '🚀 Confirm Reservation' : '🔄 Revert to Pending'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>No reservations found in the system.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;