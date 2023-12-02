import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const WalletPassword = () => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const sessionId = urlSearchParams.get('session_id');
  console.log(sessionId)

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length !== 4 || !/^\d+$/.test(newPassword)) {
      setErrorMessage('Please enter a 4-digit number.');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = () => {
    if (password.length === 4) {
      const apiUrl = `https://100088.pythonanywhere.com/api/wallet/v1/wallet-password?session_id=${sessionId}`;
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_password: password }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          console.log('API Response:', data);
          if (data.success && data.redirect_url) {
            window.location.href = data.redirect_url;
          } else {
            // Handle unsuccessful response or missing data
            console.error('Invalid response from the server');
          }
        })
        .catch((error) => {
          console.error('Error setting password:', error);
        });
    } else {
      setErrorMessage('Please enter a 4-digit number.');
    }
  };


  const styles = {
    container: {
      maxWidth: '400px',
      margin: 'auto',
      marginTop: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginBottom: '10px',
      outline: 'none',
    },
    errorMessage: {
      color: 'red',
      fontSize: '0.875rem',
      marginTop: '5px',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Set Wallet Password</h2>
      <div>
        <label htmlFor="passwordInput" style={styles.label}>
          Enter 4-digit Password:
        </label>
        <input
          type="password"
          id="passwordInput"
          value={password}
          onChange={handlePasswordChange}
          style={styles.input}
        />
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      </div>
      <button onClick={handleSubmit} style={styles.button}>
        Continue
      </button>
    </div>
  );
};

export default WalletPassword;
