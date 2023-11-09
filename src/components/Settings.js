import React, { useState } from 'react';
import { TokenManager } from './Tokenmanager'; // Import the TokenManager
import { Link, useNavigate } from 'react-router-dom';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '20px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const sectionStyle = {
  background: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
};

const buttonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
};

const checkboxStyle = {
  marginRight: '10px',
  fontSize: '18px',
};

const SettingsPage = () => {
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [disableAccount, setDisableAccount] = useState(false);
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [otp, setOTP] = useState('');
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
  };

  const handleDisableAccount = () => {
    const storedAccessToken = TokenManager.getToken();

    if (!storedAccessToken) {
      navigate('/login');
      return;
    }

    fetch('https://100088.pythonanywhere.com/api/wallet/v1/request-disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedAccessToken}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setShowOTPSection(true);
        } else {
          response.json().then((data) => {
            setError(data.message || 'Account disabling request failed. Please try again.');
          });
        }
      })
      .catch((error) => {
        console.error('Error sending account disabling request:', error);
        setError('An error occurred while sending the request.');
      });
  };

  const handleVerifyOTP = () => {
    // Implement OTP verification logic here
    // After OTP verification, you can navigate the user or perform any other actions
    // For example, navigate to a success page or perform account disabling
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Account Settings</h1>
        <Link to="/">Home</Link>
      </header>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Disable Account</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          By disabling your account, your account will be temporarily suspended and not accessible by you or others.
          This action can be reversed by re-enabling the account.
        </p>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={disableAccount}
            onChange={() => setDisableAccount(!disableAccount)}
            style={checkboxStyle}
          />
          I understand and want to disable my account
        </label>
        <button style={buttonStyle} onClick={handleDisableAccount}>
          Disable Account
        </button>
      </div>

      {showOTPSection && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>OTP Verification</h2>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Enter the OTP sent to your email or phone number.
          </p>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Delete Account</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          By deleting your account, all your data will be permanently removed from our system.
          This action cannot be undone.
        </p>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={deleteAccount}
            onChange={() => setDeleteAccount(!deleteAccount)}
            style={checkboxStyle}
          />
          I understand and want to delete my account
        </label>
        <button style={buttonStyle} onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
