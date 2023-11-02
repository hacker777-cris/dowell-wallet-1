import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
  const email = location.state.email || ''; // Retrieve email from location state with a default value
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const handleVerifyOTP = () => {
    // Construct the request body
    const requestBody = {
      otp_key: otpKey,
      email, // Use the email received from the location state
    };

    // Make a POST request to verify the OTP
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          const responseData = await response.json();
          setResponse(responseData.message); // Display the response message
          setError(null); // Clear the error message
          setOTPKey('');
          navigate('/login'); // Redirect to the login page
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          setError(errorMessage);
          setResponse(''); // Clear the success message
        }
      })
      .catch((error) => {
        console.error('Error during OTP verification:', error);
        setError('An error occurred during OTP verification.');
        setResponse('');
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
          {response && <div style={responseStyle}>{response}</div>}
          {error && <div style={errorStyle}>{error}</div>}
          <button type="button" onClick={handleVerifyOTP} style={buttonStyle}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
