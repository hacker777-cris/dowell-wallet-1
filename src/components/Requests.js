import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenManager } from './Tokenmanager'; // Import the TokenManager
import { useUser } from '../UserContext'; // Import the useUser hook;

const cardStyle = {
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.375rem',
  padding: '1.5rem',
  width: '360px',
  margin: '0 auto',
  textAlign: 'center',
};

const buttonStyle = {
  backgroundColor: '#4299e1',
  color: '#ffffff',
  borderRadius: '0.25rem',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
  marginTop: '1rem',
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
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Received Results
      </h1>
      <ul>
        {receivedResults.map((result) => (
          <li
            key={result.id}
            style={{
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              borderBottom: '1px solid #ccc',
              padding: '0.5rem 0',
            }}
          >
            Request ID: {result.custom_id}
            <br />
            Amount: ${result.amount}
            <br />
            Created At: {new Date(result.created_at).toLocaleString()}
            <br />
            <button onClick={() => handleConfirm(result.id)}>Confirm</button>
            <button onClick={() => handleCancel(result.id)}>Cancel</button>
          </li>
        ))}
      </ul>

      <Link to="/create-request" style={buttonStyle}>
        Create New Request
      </Link>
    </div>
  );
};

export default RequestsPage;
