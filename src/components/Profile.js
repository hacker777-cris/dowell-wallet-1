import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { TokenManager } from './Tokenmanager'; // Import the TokenManager
import { useUser } from '../UserContext';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '10px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const navBarStyle = {
  display: 'flex',
  alignItems: 'center',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '20px',
};

const profileContainerStyle = {
  background: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
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

const imgStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0070BA',
};

const detailStyle = {
  fontSize: '16px',
  color: '#4A4A4A',
};

const ProfilePage = () => {
  const { setSessionId } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const sessionId = urlSearchParams.get('session_id');
    const accessToken = TokenManager.getToken(); // Replace this with the actual method in TokenManager
    if (!accessToken) {
      navigate(`/login?session_id=${sessionId}`);
      return; // Stop further execution of useEffect
    }
    console.log(accessToken)

    setSessionId(sessionId);
    console.log(sessionId);
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const apiUrl = `http://127.0.0.1:8000/api/wallet/v1/profile?session_id=${sessionId}`;

    fetch(apiUrl,requestOptions)
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data.data);
        console.log(profileData)
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        setError('An error occurred while fetching profile data.');
      });
  }, [location.search, setSessionId]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={navBarStyle}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          {/* <Link to="/update-profile" style={navLinkStyle}>
            Update Profile
          </Link> */}
        </div>
        <Link to="/logout">
          <button style={buttonStyle}>Logout</button>
        </Link>
      </header>
      <div style={profileContainerStyle}>
        <img src={profileData.profile_picture} alt="Profile" style={imgStyle} />
        <h2 style={titleStyle}>Profile Details</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={detailStyle}>
          <strong>First Name:</strong> {profileData.firstname}
        </div>
        <div style={detailStyle}>
          <strong>Last Name:</strong> {profileData.lastname}
        </div>
        <div style={detailStyle}>
          <strong>Email:</strong> {profileData.email}
        </div>
        <div style={detailStyle}>
          <strong>Address:</strong> {profileData.address}
        </div>
        <div style={detailStyle}>
          <strong>Phone Number:</strong> {profileData.phone}
        </div>
        <div style={detailStyle}>
          <strong>Wallet Account Number:</strong> {profileData.account_no}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
