import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from './api/config.jsx';
import './RegistrationForm.css';
import './Login.css'; // Reuse login styles for standalone page

const RegistrationForm = ({ onTrigger, standalone = false }) => {
  const [isOpen, setIsOpen] = useState(standalone);
  const [step, setStep] = useState(1); // 1: Name/Mobile, 2: OTP
  const [formData, setFormData] = useState({ name: '', mobile_number: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (standalone) {
      setIsOpen(true);
    }
  }, [standalone]);

  // Mock API for Sending OTP
  const sendOtpApi = async (mobile_number) => {
    try {
      const response = await fetch(`${BASE_URL}/send-otp/` , { // Changed mobile to mobile_number
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile_number }),
      });
      const data = await response.json();
      return { success: response.ok, ...data };
    } catch (error) {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  // Mock API for Verifying OTP
  const verifyOtpApi = async (mobile_number, otp) => {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp/`, { // Changed mobile to mobile_number
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile_number, otp }),
      });
      const data = await response.json();
      return { success: response.ok, ...data };
    } catch (error) {
      return { success: false, message: 'Verification failed' };
    }
  };

  // Mock API for Final Registration
  const registerApi = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const handleOpen = () => {
    if (onTrigger) onTrigger();
    setIsOpen(true);
    setStep(1);
    setMessage({ type: '', text: '' });
  };

  const handleClose = () => {
    if (standalone) {
      navigate('/');
    } else {
      setIsOpen(false);
      setFormData({ name: '', mobile_number: '', password: '' });
      setOtp('');
    }
  };

  const onSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile_number || !formData.password) return; // Changed mobile to mobile_number
    
    setLoading(true);
    const res = await sendOtpApi(formData.mobile_number); // Changed mobile to mobile_number
    setLoading(false);

    if (res.success) {
      setStep(2);
      setMessage({ type: 'info', text: res.message || 'OTP sent successfully!' });
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to send OTP.' });
    }
  };

  const onVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const verifyRes = await verifyOtpApi(formData.mobile_number, otp); // Changed mobile to mobile_number
    if (verifyRes.success) {
      const regRes = await registerApi(formData);
      if (regRes.success) {
        setMessage({ type: 'success', text: 'Registration Successful! Welcome Adventurer.' });
        setTimeout(handleClose, 2000);
      } else {
        setMessage({ type: 'error', text: regRes.message || 'Registration failed.' });
      }
    } else {
      setMessage({ type: 'error', text: verifyRes.message || 'Invalid OTP. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className={standalone ? "login-page" : "registration-container"}>
      {!standalone && <button className="nav-register-btn" onClick={handleOpen}>Register</button>}

      {isOpen && (
        <div className={standalone ? "login-card animate-pop-in" : "modal-overlay"}>
          <div className={standalone ? "" : "modal-content animate-pop-in"}>
            {!standalone ? <button className="close-btn" onClick={handleClose}>✕</button> : (
              <div style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>← Back to Base Camp</Link>
              </div>
            )}
            
            <div className={standalone ? "login-header" : "modal-header"}>
              {standalone && <div style={{ fontSize: '3.5rem', marginBottom: '10px', textAlign: 'center' }}>🎒</div>}
              <h2 style={{ fontSize: standalone ? '2rem' : 'inherit', fontWeight: '800' }}>{step === 1 ? 'Start Your Journey' : 'Verify Mobile'}</h2>
              <p style={{ color: '#64748b' }}>{step === 1 ? 'Fill in your details to get started.' : `Enter the code sent to ${formData.mobile_number}`}</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <form onSubmit={step === 1 ? onSendOtp : onVerifyAndRegister}>
              {step === 1 ? (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="Enter 10-digit number" 
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      placeholder="Create a secure password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>One-Time Password</label>
                    <input 
                      type="text" 
                      placeholder="6-digit OTP" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Register'}
                  </button>
                  <button type="button" className="btn-link" onClick={() => setStep(1)}>Change Number</button>
                </>
              )}
            </form>
            {standalone && (
              <div style={{ marginTop: '25px', textAlign: 'center', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Already tracking trails? <Link to="/login" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;