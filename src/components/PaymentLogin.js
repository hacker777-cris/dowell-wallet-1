import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming React Router is used

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initializationId, setInitializationId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control confirmation dialog
  const [price, setPrice] = useState(0); // State to hold the price
  const location = useLocation();

 
useEffect(() => {
  // Extract initiation_id and price from URL params
  const searchParams = new URLSearchParams(location.search);
  const initializationIdFromParams = searchParams.get('initialization_id');
  const priceFromParams = searchParams.get('price'); // Extract price from URL params
  console.log('initialization ID from URL:', initializationIdFromParams);
  console.log('Price from URL is:', priceFromParams);



  if (initializationIdFromParams) {
    setInitializationId(initializationIdFromParams);
    // Set the price from URL params to state
    if (priceFromParams) {
      setPrice(parseFloat(priceFromParams)); // Convert to a number if needed
    }
  }
}, [location.search]);
  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmationSubmit = async () => {
    setShowConfirmation(false); // Hide confirmation dialog
    try {
      // Proceed with the POST request after confirmation
      const response = await fetch('https://100088.pythonanywhere.com/api/wallet/v1/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          initialization_id: initializationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error || 'Unknown error');
        return;
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error('No callback URL received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
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
          Authorize Payment
        </button>
      </form>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Confirm payment of ${price}?</p>
          <button onClick={handleConfirmationSubmit}>Confirm</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
        </div>
      )}
    </div>
    
  );
};

export default LoginForm;
