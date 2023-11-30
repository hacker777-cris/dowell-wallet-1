import React, { useState, useEffect } from 'react';
import { TokenManager } from './Tokenmanager';
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

const sectionStyle = {
  background: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
};

const buttonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
};

const checkboxStyle = {
  marginRight: '10px',
  fontSize: '18px',
};


const SettingsPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // Import useNavigate hook

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionIdFromParams = searchParams.get('session_id');
    setSessionId(sessionIdFromParams);
  }, [location.search]);

  const handleGetTransactionHistory = () => {
    if (!sessionId) {
      setError('Session ID not found.');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/wallet/v1/transactions-history/?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json(); // Parse the response body as JSON
        } else {
          response.json().then((data) => {
            setError(data.message || 'Failed to fetch transaction history.');
          });
        }
      })
      .then((data) => {
        if (data) {
          setMessage(data.message);

          // Add a delay before redirecting
          setTimeout(() => {
            navigate(`/?session_id=${sessionId}`);
          }, 3000); // Redirect after 3 seconds (3000 milliseconds)
        }
      })
      .catch((error) => {
        console.error('Error fetching transaction history:', error);
        setError('An error occurred while fetching transaction history.');
      });
  };

  return (
    <div style={containerStyle}>
      {/* ... (existing code) */}

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Get Transaction History</h2>
        <button style={buttonStyle} onClick={handleGetTransactionHistory}>
          Get Transaction History
        </button>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>

      {/* ... (existing code) */}
    </div>
  );
};

export default SettingsPage;