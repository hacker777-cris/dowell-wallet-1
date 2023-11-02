import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';

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
  justifyContent: 'space between',
  alignItems: 'center',
};

const logoStyle = {
  width: '100px',
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

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = () => {
    // Check if the amount is valid (you can add more validation here)
    if (!amount || isNaN(parseFloat(amount))) {
      setMessage('Please enter a valid amount.');
      return;
    }
  
    const apiUrl = 'https://100088.pythonanywhere.com/api/wallet/v1/stripe-payment';
    const storedAccessToken = localStorage.getItem('accessToken');

    if (!storedAccessToken) {
      // Handle the case where the access token is not available in local storage
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`, // Use the stored access token
      },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    })
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);

      if (data.success) {
        // If the deposit is successful, redirect to the approval URL
        window.location.href = data.approval_url;
      }
    })
    .catch((error) => {
      console.error('Error making a deposit:', error);
      setMessage('An error occurred. Please try again.');
    });
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <img src="paypal_logo.png" alt="Dowell wallet" style={logoStyle} />
      </header>
      <div style={formContainerStyle}>
        <h2>Deposit Money</h2>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <input
          style={inputStyle}
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button style={buttonStyle} onClick={handleDeposit}>
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositPage;
