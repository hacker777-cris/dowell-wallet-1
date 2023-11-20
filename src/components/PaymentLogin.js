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
  
    try {
      const response = await fetch('YOUR_API_ENDPOINT/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          initiation_id: initiationId, // Send initiation_id in the body
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Handle response data or redirect after successful login
        console.log('Login response:', data);
  
        // Check if there's a callback URL in the response data
        if (data.callback_url) {
          window.location.href = data.callback_url; // Redirect to the callback URL
        } else {
          console.error('No callback URL received');
          // Handle this case accordingly
        }
      } else {
        // Handle unsuccessful response (e.g., display an error message)
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      // Handle error
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
