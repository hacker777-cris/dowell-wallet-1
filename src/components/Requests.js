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

const createRequestStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '0.375rem',
  padding: '1rem',
  margin: '1rem 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const inputContainer = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  fontSize: '1rem',
  borderRadius: '0.25rem',
  border: '1px solid #ccc',
};

const buttonStyle = {
  backgroundColor: '#009cde',
  color: '#fff',
  borderRadius: '0.25rem',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
  // Add any additional button styles
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



const RequestsPage = () => {
  const [receivedResults, setReceivedResults] = useState([]);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const { setAccessToken } = useUser();

  useEffect(() => {
    const storedAccessToken = TokenManager.getToken();
  
    if (!storedAccessToken) {
      navigate('/login');
      return;
    }
    setAccessToken(storedAccessToken);
  
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
      .then((data) => {
        // Combine confirmed and pending requests into a single array
        const allRequests = data.data.confirmed_requests.concat(data.data.pending_requests);
        setReceivedResults(allRequests);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate, setAccessToken]);
  

  const handleConfirm = (customId) => {
    console.log('Confirm Request Payload:', { custom_id: customId });
  
    const storedAccessToken = TokenManager.getToken();
  
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/accept-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`,
      },
      body: JSON.stringify({
        custom_id: customId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Request confirmed!');
          // Reload the page or update the state as needed
        } else {
          throw new Error('Failed to confirm request');
        }
      })
      .catch((error) => {
        console.error(error);
        console.log(customId);
      });
  };
  

  const handleCancel = (customId) => {
    console.log(`Cancelled request with ID: ${customId}`);
  };

  const handleCreateRequestClick = () => {
    setShowCreateRequest(true);
  };

  const handleCloseCreateRequest = () => {
    setShowCreateRequest(false);
  };

  const handleRequest = () => {
    const accountNumber = document.getElementById('accountNumber').value;
    const amount = document.getElementById('amount').value;

    const storedAccessToken = TokenManager.getToken();

    fetch('https://100088.pythonanywhere.com/api/wallet/v1/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`,
      },
      body: JSON.stringify({
        account_no: accountNumber,
        amount: amount,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Request successful!');
          // Reload the page
        } else {
          throw new Error('Failed to create request');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={cardStyle}>
      <div style={cardHeader}>Received Requests</div>
      {successMessage && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>}
      {Array.isArray(receivedResults) ? (
        receivedResults.map((result) => (
          <div key={result.id} style={requestCard}>
            <div>
              <strong>Request ID: {result.custom_id}</strong>
            </div>
            <div>Amount: ${result.amount}</div>
            <div>Created At: {new Date(result.created_at).toLocaleString()}</div>
            <div>
              {result.is_confirmed ? (
                <div style={{ color: 'green' }}>Confirmed</div>
              ) : (
                <React.Fragment>
                  <button onClick={() => handleConfirm(result.custom_id.toString())} style={buttonStyle}>
                    Confirm
                  </button>
                  <button onClick={() => handleCancel(result.id)} style={buttonStyle}>
                    Cancel
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No received requests</div>
      )}
      <button onClick={handleCreateRequestClick} style={buttonStyle}>
        Create New Request
      </button>

      {showCreateRequest && (
        <div style={createRequestStyle}>
          <div style={inputContainer}>
            <label htmlFor="accountNumber" style={labelStyle}>
              Account Number:
            </label>
            <input type="text" id="accountNumber" style={inputStyle} />
          </div>
          <div style={inputContainer}>
            <label htmlFor="amount" style={labelStyle}>
              Amount:
            </label>
            <input type="text" id="amount" style={inputStyle} />
          </div>
          <button onClick={handleCloseCreateRequest} style={buttonStyle}>
            Close
          </button>
          <button onClick={handleRequest} style={buttonStyle}>
            Request
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;