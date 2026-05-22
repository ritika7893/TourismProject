import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { BASE_URL } from './api/config.jsx';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ mobile_number: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  // If we were redirected here due to a session expiry, show the message
  useEffect(() => {
    if (authError) {
      setError(authError);
      setAuthError(null); // Clear context error after showing it locally
    }
  }, [authError, setAuthError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        // Update auth context and persist tokens
        login({ 
          access_token: data.access_token, 
          refresh_token: data.refresh_token,
          user_id: data.user_id, // Store user_id from response
          role: data.role // Store role from response
        });
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-pop-in">
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>← Back to Base Camp</Link>
        </div>
        <div className="login-header">
          <div style={{ fontSize: '3.5rem', marginBottom: '10px', textAlign: 'center' }}>🏔️</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: '1.1rem' }}>Sign in to continue tracking your adventure.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile_number"
              placeholder="Enter mobile number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          New to adventure tracking? <Link to="/register" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;