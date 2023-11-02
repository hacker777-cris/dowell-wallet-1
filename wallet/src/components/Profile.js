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
  const { setAccessToken } = useUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');

    if (!storedAccessToken) {
      // If no access token is found, navigate to the login page
      navigate('/login');
      return;
    }

    // Fetch the user's profile data with the stored access token
    fetch('https://100088.pythonanywhere.com/api/wallet/v1/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
            throw new Error(`Failed to retrieve profile data. Status: ${response.status}`);
        }
      })
      .then((data) => {
        setProfileData(data.data);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        setError('An error occurred while fetching profile data.');
      });
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={navBarStyle}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <Link to="/update-profile" style={navLinkStyle}>
            Update Profile
          </Link>
        </div>
        <Link to="/logout">
          <button style={buttonStyle}>Logout</button>
        </Link>
      </header>
      <div style={profileContainerStyle}>
        <img src={`https://100088.pythonanywhere.com${profileData.profile_picture}`} alt="Profile" style={imgStyle} />
        <h2 style={titleStyle}>Profile Details</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={detailStyle}>
          <strong>First Name:</strong> {profileData.firstname}
        </div>
        <div style={detailStyle}>
          <strong>Last Name:</strong> {profileData.lastname}
        </div>
        <div style={detailStyle}>
          <strong>Phone Number:</strong> {profileData.phone_number}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
