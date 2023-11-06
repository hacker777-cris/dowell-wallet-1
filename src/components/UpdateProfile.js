import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TokenManager } from './Tokenmanager';

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

const formContainerStyle = {
  background: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const labelStyle = {
  fontSize: '18px',
  color: '#0070BA',
  marginBottom: '10px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
};

const imgStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '20px',
};

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the data as a multipart/form-data request
    const formData = new FormData();
    formData.append('profile_picture', profilePicture);
    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('phone_number', phoneNumber);

    // Send a POST request with the FormData
    try {
      const storedAccessToken = TokenManager.getToken(); // Retrieve the access token using TokenManager

      if (!storedAccessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://100088.pythonanywhere.com/api/wallet/v1/profile', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${storedAccessToken}`,
        },
      });

      if (response.ok) {
        // Profile update successful
        console.log('Profile updated successfully');
        navigate('/profile'); // Navigate to the /profile page
      } else {
        // Handle errors
        const data = await response.json();
        setError(data.error);
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('An error occurred while updating the profile:', error);
      setError('An error occurred while updating the profile.');
    }
  };


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
      </header>
      <div style={formContainerStyle}>
        <h1>Update Profile</h1>
        <form style={formStyle} onSubmit={handleSubmit}>
          <label style={labelStyle} htmlFor="profile-picture">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile-picture"
            accept=".jpg, .jpeg, .png"
            onChange={handleProfilePictureChange}
          />
          {profilePicture && (
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="Profile Preview"
              style={imgStyle}
            />
          )}
          <label style={labelStyle} htmlFor="first-name">
            First Name
          </label>
          <input
            style={inputStyle}
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label style={labelStyle} htmlFor="last-name">
            Last Name
          </label>
          <input
            style={inputStyle}
            type="text"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label style={labelStyle} htmlFor="phone-number">
            Phone Number
          </label>
          <input
            style={inputStyle}
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>
            Update Profile
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
