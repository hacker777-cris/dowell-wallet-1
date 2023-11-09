import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenManager } from './Tokenmanager'; // Import the TokenManager
import { useUser } from '../UserContext'; // Import the useUser hook;

const cardStyle = {
  backgroundColor: '#f1f1f1',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.375rem',
  padding: '1.5rem',
  width: '360px',
  margin: '0 auto',
  textAlign: 'center',
};

const cardHeader = {
  backgroundColor: '#009cde',
  color: '#fff',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  padding: '1rem 0',
  borderRadius: '0.375rem 0.375rem 0 0',
};

const requestCard = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '0.375rem',
  padding: '1rem',
  margin: '1rem 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#009cde',
  color: '#fff',
  borderRadius: '0.25rem',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
  textDecoration: 'none',
};

const RequestsPage = () => {
  const [receivedResults, setReceivedResults] = useState([]);
  const navigate = useNavigate();
  const { setAccessToken } = useUser();

  useEffect(() => {
    // Retrieve the access token from the TokenManager
    const storedAccessToken = TokenManager.getToken();

    if (!storedAccessToken) {
      navigate('/login');
      return;
    }
    setAccessToken(storedAccessToken);

    // Make a GET request to retrieve user requests
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/user-request', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user requests');
        }
      })
      .then((data) => setReceivedResults(data.data))
      .catch((error) => {
        console.error(error);
        // Handle the error or show an error message to the user
      });
  }, [navigate, setAccessToken]);

  const handleConfirm = (requestId) => {
    // Implement the logic to confirm the request with the given ID
    console.log(`Confirmed request with ID: ${requestId}`);
  };

  const handleCancel = (requestId) => {
    // Implement the logic to cancel the request with the given ID
    console.log(`Cancelled request with ID: ${requestId}`);
  };

  return (
    <div style={cardStyle}>
      <div style={cardHeader}>Received Requests</div>
      {receivedResults.map((result) => (
        <div key={result.id} style={requestCard}>
          <div>
            <strong>Request ID: {result.custom_id}</strong>
          </div>
          <div>Amount: ${result.amount}</div>
          <div>Created At: {new Date(result.created_at).toLocaleString()}</div>
          <div>
            <button onClick={() => handleConfirm(result.id)} style={buttonStyle}>
              Confirm
            </button>
            <button onClick={() => handleCancel(result.id)} style={buttonStyle}>
              Cancel
            </button>
          </div>
        </div>
      ))}
      <Link to="/create-request" style={buttonStyle}>
        Create New Request
      </Link>
    </div>
  );
};

export default RequestsPage;
