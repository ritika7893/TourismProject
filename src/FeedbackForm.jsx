import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { BASE_URL } from './api/config.jsx';

const FeedbackForm = ({ onBack }) => {
  const { user, accessToken } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      user_id: user?.user_id || '',
      feedback: feedback
    };

    try {
      const response = await fetch(`${BASE_URL}/feedback/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you for your feedback!' });
        setFeedback('');
        setTimeout(() => {
          onBack();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to submit feedback.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-centered" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1rem' }}>
        <button onClick={onBack} className="btn-back">← Back to Dashboard</button>
      </div>
      <div className="dash-card user-card animate-pop-in" style={{ maxWidth: '600px', width: '100%', padding: '30px' }}>
        <div className="card-header" style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b' }}>💬 Submit Feedback</h2>
          <p style={{ color: '#7f8c8d' }}>Help us improve your trekking experience.</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{
            padding: '12px', borderRadius: '8px', marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Explorer ID</label>
            <input 
              type="text" 
              value={user?.user_id || ''} 
              disabled 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%', backgroundColor: '#f1f5f9' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Feedback Message</label>
            <textarea 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }} 
              placeholder="Your message..."
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              rows="5" 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>
            {loading ? 'Submitting...' : 'Post Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;