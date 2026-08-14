import { useState } from 'react';
import './Login.css';
import { Container } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle email input changes
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Handle successful password reset
      setIsSubmitted(true);

    } catch {
      alert('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper has-icon">
                  <span className="input-icon"><i className="ri-user-line"></i></span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`${error ? 'error' : ''} form-control py-2`}
                    disabled={isLoading}
                  />
                </div>
                {error && <span className="error-message">{error}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="success-message text-center mb-4 pb-1">
              <i className="ri-checkbox-circle-line" style={{ fontSize: '60px', color: '#28a745' }}></i>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <button 
                className="btn btn-primary mt-3 px-4 py-2 w-100"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
              >
                Send Again
              </button>
            </div>
          )}

          <div className="login-footer">
            <p>Remember your password? <a href="login">Sign In</a></p>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="cv-footer">
        <Container className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          <div>© {new Date().getFullYear()} 3pl3sixty LLC, Wyoming, 82801. All rights reserved.</div>
        </Container>
      </footer>
    </>
  );
};

export default ForgotPassword;