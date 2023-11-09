import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  // State to store received results
  const [receivedResults, setReceivedResults] = useState([]);

  useEffect(() => {
    // Fetch and set received results here
    // Example:
    // fetch('API endpoint to get received results')
    //   .then((response) => response.json())
    //   .then((data) => setReceivedResults(data));
  }, []);

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
            {result.text}
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
