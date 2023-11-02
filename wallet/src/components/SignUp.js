import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Construct the request body
    const requestBody = {
      username,
      email,
      password,
      confirmPassword,
    };

    // Implement your signup logic here
    // For example, make a POST request to create a new user
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          // Signup was successful, you can redirect to OTP verification page
          setResponse('Signup successful. You can now verify your OTP.');
          setError(null); // Clear the error message
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          navigate('/otp-verification', { state: { email } }); // Redirect to the OTP verification page
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          setError(errorMessage);
          setResponse('');
        }
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        setError('An error occurred during signup.');
        setResponse('');
      });
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSignup}>
        <h1 style={headingStyle}>Signup</h1>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div>
          <label style={labelStyle} htmlFor="username">
            Username:
          </label>
          <input
            style={inputStyle}
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">
            Email:
          </label>
          <input
            style={inputStyle}
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="password">
            Password:
          </label>
          <input
            style={inputStyle}
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            style={inputStyle}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {response && <div style={{ color: 'green', marginBottom: '1rem' }}>{response}</div>}
        <div>
          <button style={buttonStyle} type="submit">
            Signup
          </button>
        </div>
        <div>
          <Link to="/login" style={linkStyle}>
            Already registered? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
