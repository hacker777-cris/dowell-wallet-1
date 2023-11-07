import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f7fafc',
};

const formStyle = {
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.375rem',
  padding: '1.5rem',
  width: '360px',
  textAlign: 'center',
};

const headingStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  color: '#4a5568',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const inputStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '0.25rem',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  fontSize: '0.875rem',
};

const buttonStyle = {
  backgroundColor: '#4299e1',
  color: '#ffffff',
  borderRadius: '0.25rem',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const linkStyle = {
  color: '#4299e1',
  textDecoration: 'none',
  fontSize: '0.875rem',
};

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [resetRequestSent, setResetRequestSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetRequest = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Send a POST request to request password reset with the email
    fetch('https://100088.pythonanywhere.com//api/wallet/v1/request-reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Request successful
          // Generate and send OTP to the user's email
          // Store the OTP and email for verification
          setResetRequestSent(true);
        } else {
          // Handle error response
          setError('Failed to request password reset. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error requesting password reset:', error);
        setError('An error occurred. Please try again.');
      });
  };

  const handleResetPassword = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const resetData = {
      otp,
      email,
      new_password: newPassword,
    };

    fetch('https://100088.pythonanywhere.com/api/wallet/v1/verify-password-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    })
      .then((response) => {
        if (response.status === 200) {
          // Password reset was successful
          setError(''); // Clear any previous error message
          setResetSuccess(true); // Set resetSuccess to true
          navigate('/login');
        } else {
          setError('Failed to reset the password. Please try again.');
          setResetSuccess(false); // Reset the success state
        }
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        setError('An error occurred. Please try again.');
        setResetSuccess(false); // Reset the success state
      });
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle}>
        <h1 style={headingStyle}>Password Reset</h1>
        {resetRequestSent ? (
          <>
            <div>
              <label style={labelStyle} htmlFor="otp">
                Enter OTP:
              </label>
              <input
                style={inputStyle}
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="newPassword">
                New Password:
              </label>
              <input
                style={inputStyle}
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {resetSuccess ? (
              <p style={{ color: 'green' }}>Password reset successful.</p>
            ) : (
              <div>
                <button style={buttonStyle} onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label style={labelStyle} htmlFor="email">
                Enter your email:
              </label>
              <input
                style={inputStyle}
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              <button style={buttonStyle} onClick={handleResetRequest}>
                Request Password Reset
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default PasswordResetPage;
