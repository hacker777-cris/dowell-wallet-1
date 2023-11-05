import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const errorStyle = {
  color: 'red',
  margin: '10px 0',
};

const ErrorMessage = ({ error }) => {
  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }
  return null;
};

const TransferPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [accountNo, setAccountNo] = useState(''); // Updated variable name
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleTransfer = () => {
    // Check if there is an access token in localStorage
    const storedAccessToken = localStorage.getItem('accessToken');
    if (!storedAccessToken) {
      navigate('/login'); // Redirect to the login page using useNavigate
      return;
    }
  
    // Construct the request body
    const requestBody = {
      account_no: accountNo, // Updated variable name
      amount: parseInt(amount, 10), // Convert amount to an integer
    };
  
    // Implement your transfer logic here
    // For example, make a POST request to transfer funds
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`,
      },
      body: JSON.stringify(requestBody), // Send the correct request body
    })
      .then(async (response) => {
        if (response.ok) {
          // Transfer was successful, you can redirect or show a success message
          navigate('/'); // Redirect to the confirmation page
        } else {
          const errorData = await response.json(); // Parse the JSON response
          const errorMessage = errorData.message; // Extract the error message
          setError(errorMessage); // Set the error message state to the user-friendly error message
        }
      })
      .catch((error) => {
        console.error('Error transferring funds:', error);
        setError('An error occurred while transferring funds.'); // Set a generic error message
      });
  };
  
  

  useEffect(() => {
    // Check if the access token is available in localStorage when the page loads
    const storedAccessToken = localStorage.getItem('accessToken');
    if (!storedAccessToken) {
      navigate('/login'); // Redirect to the login page using useNavigate
    }
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Transfer Funds</h1>
        <Link to="/">Home</Link>
      </header>
      <div style={formContainerStyle}>
        <form>
        <label htmlFor="accountNo">Recipient's Account Number</label>
          <input
            type="text"
            id="accountNo"
            name="accountNo"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            style={inputStyle}
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />
          <ErrorMessage error={error} />
          <button type="button" onClick={handleTransfer} style={buttonStyle}>
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferPage;
