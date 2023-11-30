import React, { useState, useEffect } from 'react';
import { useNavigate,  useParams } from 'react-router-dom';
import { TokenManager } from './Tokenmanager'; 
import { useLocation } from 'react-router-dom'; // Assuming React Router is used


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
  const navigate = useNavigate();
  const location = useLocation();
  const [depositmethod, setDepositMethod] = useState('');
  const[sessionId, setSessionId] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const method = searchParams.get('method'); // Extract method from URL params
    // Extract the session ID from the URL parameters
    const urlSearchParams = new URLSearchParams(location.search);
    const sessionId = urlSearchParams.get('session_id');

    if (method) {
      setDepositMethod(method);
    }
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, [location.search]);

  const handleDeposit = () => {
    // Check if the amount is valid (you can add more validation here)
    if (!amount || isNaN(parseFloat(amount))) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const stripeapiUrl = `https://100088.pythonanywhere.com/api/wallet/v1/stripe-payment?session_id=${sessionId}`;
  const paypalapiUrl = `https://100088.pythonanywhere.com/api/wallet/v1/paypal-payment?session_id=${sessionId}`;

  const apiUrl = depositmethod === 'paypal' ? paypalapiUrl : stripeapiUrl; // Select API URL based on deposit method

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: parseFloat(amount) }),
  })
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);

      if (data.success) {
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
      <h2>Deposit Money via {depositmethod && depositmethod.toUpperCase()}</h2>
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