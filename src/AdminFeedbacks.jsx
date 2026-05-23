import React from 'react';
import { BASE_URL } from './api/config.jsx';

const AdminFeedbacks = ({ feedbacks, onBack, accessToken, onRefresh }) => {

  const handleToggleValidity = async (feedbackId, currentStatus) => {
    const newStatus = !currentStatus;
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'publish' : 'unpublish'} this story?`)) return;

    try {
      const response = await fetch(`${BASE_URL}/feedback/${feedbackId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_valid: newStatus })
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to update visibility status. Check if your backend supports PUT for feedback.");
      }
    } catch (err) {
      console.error("Error updating visibility:", err);
    }
  };

  return (
    <div className="admin-feedbacks-view animate-pop-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 10px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Explorer Feedback</h2>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: '600' }}>← Back to Overview</button>
      </div>

      <div className="dashboard-cards">
        {feedbacks.length > 0 ? (
          feedbacks.map((f) => (
            <div className="dash-card admin-card animate-pop-in" key={f.id} style={{ borderLeft: '5px solid #6366f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{f.user_name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {f.user_id}</span>
              </div>
              <p style={{ 
                fontStyle: 'italic', 
                color: '#334155', 
                fontSize: '0.95rem', 
                lineHeight: '1.6',
                backgroundColor: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                "{f.feedback}"
              </p>
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button 
                  onClick={() => handleToggleValidity(f.id, f.is_valid)}
                  className="btn"
                  style={{ 
                    marginRight: '12px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    backgroundColor: f.is_valid ? '#fff1f2' : '#f0fdf4',
                    color: f.is_valid ? '#e11d48' : '#166534',
                    border: `1px solid ${f.is_valid ? '#fecdd3' : '#bbf7d0'}`,
                    fontWeight: '700'
                  }}
                >
                  {f.is_valid ? '🚫 Unpublish' : '✅ Publish Story'}
                </button>
                 <span style={{ 
                  backgroundColor: f.is_valid ? '#ecfdf5' : '#f1f5f9',
                  color: f.is_valid ? '#047857' : '#64748b',
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.65rem', 
                  fontWeight: '800'
                }}>
                  {f.is_valid ? '✓ PUBLISHED' : '○ UNDER REVIEW'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>No explorer stories discovered yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;