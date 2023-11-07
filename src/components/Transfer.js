import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { TokenManager } from './Tokenmanager'; 

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
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmation = () => {
    setIsConfirmed(true);
  };

  const handleTransfer = () => {
    const storedAccessToken = TokenManager.getToken(); // Retrieve the access token using TokenManager

    if (!storedAccessToken) {
      navigate('/login');
      return;
    }

    const requestBody = {
      account_no: accountNo,
      amount: parseInt(amount, 10),
    };

    fetch('https://100088.pythonanywhere.com/api/wallet/v1/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          navigate('/');
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          setError(errorMessage);
        }
      })
      .catch((error) => {
        console.error('Error transferring funds:', error);
        setError('An error occurred while transferring funds.');
      });
  };

  useEffect(() => {
    const storedAccessToken = TokenManager.getToken();

    if (!storedAccessToken) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Transfer Funds</h1>
        <Link to="/">Home</Link>
      </header>
      {isConfirmed ? (
        // Confirmation screen
        <div style={formContainerStyle}>
          <h2>Confirm Transfer</h2>
          <p>Recipient's Account Number: {accountNo}</p>
          <p>Amount: {amount}</p>
          <button type="button" onClick={handleTransfer} style={buttonStyle}>
            Confirm
          </button>
          <button type="button" onClick={() => setIsConfirmed(false)} style={buttonStyle}>
            Cancel
          </button>
        </div>
      ) : (
        // Transfer form
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
            <button type="button" onClick={handleConfirmation} style={buttonStyle}>
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransferPage;