import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  width: '100%',
  fontSize: '16px',
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [disableAccount, setDisableAccount] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = () => {
    // Implement password change logic here
    // Check if the current password is correct, and if the new password and confirm new password match
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
  };

  const handleDisableAccount = () => {
    // Implement account disabling logic here
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Account Settings</h1>
        <Link to="/">Home</Link>
      </header>
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Change Password</h2>
        <label style={labelStyle} htmlFor="currentPassword">
          Current Password:
        </label>
        <input
          style={inputStyle}
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label style={labelStyle} htmlFor="newPassword">
          New Password:
        </label>
        <input
          style={inputStyle}
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label style={labelStyle} htmlFor="confirmNewPassword">
          Confirm New Password:
        </label>
        <input
          style={inputStyle}
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <button style={buttonStyle} onClick={handleChangePassword}>
          Change Password
        </button>
        {error && <p style={{ color: 'red', fontSize: '18px', marginTop: '10px' }}>{error}</p>}
        {message && <p style={{ color: 'green', fontSize: '18px', marginTop: '10px' }}>{message}</p>}
      </div>
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Delete Account</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          By deleting your account, all your data will be permanently removed from our system.
          This action cannot be undone.
        </p>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={deleteAccount} onChange={() => setDeleteAccount(!deleteAccount)} style={checkboxStyle} />
          I understand and want to delete my account
        </label>
        <button style={buttonStyle} onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Disable Account</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          By disabling your account, your account will be temporarily suspended and not accessible by you or others.
          This action can be reversed by re-enabling the account.
        </p>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={disableAccount} onChange={() => setDisableAccount(!disableAccount)} style={checkboxStyle} />
          I understand and want to disable my account
        </label>
        <button style={buttonStyle} onClick={handleDisableAccount}>
          Disable Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
