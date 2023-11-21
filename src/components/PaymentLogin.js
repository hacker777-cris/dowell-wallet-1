import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming React Router is used

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initiationId, setInitiationId] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Extract initiation_id from URL params
    const searchParams = new URLSearchParams(location.search);
    const initiationIdFromParams = searchParams.get('initiation_id');
    if (initiationIdFromParams) {
      setInitiationId(initiationIdFromParams);
    }
  }, [location.search]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('Initialization ID:', initiationId);
  
    try {
      const response = await fetch('https://100088.pythonanywhere.com/api/wallet/v1/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          initialization_id: initiationId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error response
        console.error('Login failed:', errorData.error || 'Unknown error');
        return; // Exit function early if there's an error
      }
  
      const data = await response.json();
      console.log('Login response:', data);
  
      if (data.callback_url) {
        window.location.href = data.callback_url;
      } else {
        console.error('No callback URL received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Login</h2>
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          margin: '0 auto',
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
