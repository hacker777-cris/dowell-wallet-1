import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { TokenManager } from './Tokenmanager';

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

const LoginPage = () => {  
  const { setAccessToken } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = 'https://100088.pythonanywhere.com/api/wallet/v1/login';
    const requestBody = {
      email,
      password,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          TokenManager.setToken(data.access_token, 120);
          setAccessToken(data.access_token);
          navigate('/');
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        setError('An error occurred. Please try again.');
        console.error('Error logging in:', error);
      });
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={headingStyle}>Login</h1>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div>
          <label style={labelStyle} htmlFor="login-email">Email:</label>
          <input
            style={inputStyle}
            id="login-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="login-password">Password:</label>
          <input
            style={inputStyle}
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label style={labelStyle} htmlFor="show-password">
            Show Password
          </label>
          <input
            type="checkbox"
            id="show-password"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Toggle password visibility
          />
        </div>
        <div>
          <button style={buttonStyle} type="submit">
            Login
          </button>
        </div>
        <div>
          <a href="/signup" style={linkStyle}>
            Not registered yet? Sign up
          </a>
        </div>
        <div>
          <a href="/password-reset" style={linkStyle}>
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;