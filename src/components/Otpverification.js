import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import useUser from your context file

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

const formContainerStyle = {
  background: 'white',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '20px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#0070BA',
  fontSize: '0.875rem',
  marginLeft: '10px', // Added margin for spacing
  display: 'flex',
  alignItems: 'center',
};

const timerStyle = {
  marginLeft: '10px',
  fontSize: '0.875rem',
  color: '#999',
};

const responseStyle = {
  color: 'green',
  marginBottom: '10px',
};

const errorStyle = {
  color: 'red',
  margin: '10px 0',
};

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpKey, setOTPKey] = useState('');
  const { email, setEmail } = useUser(); // Use the email and setEmail from the context
  const [newPassword, setNewPassword] = useState('');
  const [response, setResponse] = useState('');
  const { setSessionId } = useUser();
  const { sessionId } = useUser(); // Assuming sessionId is set using useEffect
  const [error, setError] = useState(null);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60); // Initial remaining time in seconds

  console.log('Email in state:', email); // Debugging line

  useEffect(() => {
    let timerInterval;

    // If the "Resend OTP" link is disabled, start a timer to enable it after 1 minute
    if (isResendDisabled) {
      timerInterval = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime(remainingTime - 1);
        } else {
          clearInterval(timerInterval);
          setIsResendDisabled(false);
        }
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isResendDisabled, remainingTime]);

  const handleVerifyOTP = () => {
    const urlSearchParams = new URLSearchParams(location.search);
    const sessionId = urlSearchParams.get('session_id');

    const requestBody = {
      otp: otpKey,
      wallet_password: newPassword, // Include the new password in the request body
    };
    const apiUrl =  `http://127.0.0.1:8000/api/wallet/v1/setup-new-pass?session_id=${sessionId}`
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          const responseData = await response.json();
          setResponse(responseData.message);
          setError(null);
          setOTPKey('');
          setNewPassword('');
          navigate(`/login?session_id=${sessionId}`);
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          setError(errorMessage);
          setResponse('');
        }
      })
      .catch((error) => {
        console.error('Error during OTP verification:', error);
        setError('An error occurred during OTP verification.');
        setResponse('');
      });
  };

  const handleResendOTP = () => {
    const urlSearchParams = new URLSearchParams(location.search);
    const sessionId = urlSearchParams.get('session_id');
    // Prevent multiple clicks while the link is disabled
    if (isResendDisabled) {
      return;
    }

    // Make a POST request to resend the OTP
    fetch(`http://127.0.0.1:8000/api/wallet/v1/resend-otp?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setResponse('OTP resent successfully');
          setIsResendDisabled(true); // Disable the "Resend OTP" link
          setRemainingTime(60); // Reset the timer
          console.log('Session ID after resend:', sessionId);
        } else {
          setError('Failed to resend OTP');
        }
      })
      .catch((error) => {
        console.error('Error during OTP resend:', error);
        setError('An error occurred while resending OTP.');
      });
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>OTP Verification</h1>
        <Link to="/login">Login</Link>
      </header>
      <div style={formContainerStyle}>
        <form>
          <label htmlFor="otpKey">OTP Key</label>
          <input
            type="text"
            id="otpKey"
            name="otpKey"
            value={otpKey}
            onChange={(e) => setOTPKey(e.target.value)}
            style={inputStyle}
          />
          <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
          {response && <div style={responseStyle}>{response}</div>}
          {error && <div style={errorStyle}>{error}</div>}
          <button type="button" onClick={handleVerifyOTP} style={buttonStyle}>
            Verify OTP
          </button>
          <Link to="#" onClick={handleResendOTP} style={linkStyle} disabled={isResendDisabled}>
            Resend OTP
            {isResendDisabled && <span style={timerStyle}> ({remainingTime}s)</span>}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationPage;