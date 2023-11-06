import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { TokenManager } from './Tokenmanager'; // Import the TokenManager
import Loader from './Loader'; // Import the Loader component
import logoImage from '../images/Logo.png';

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  height: '40px',
  width: '40px',
};

const navBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const navItemStyle = {
  marginLeft: '20px',
  color: 'white',
  textDecoration: 'none',
  cursor: 'pointer',
};

const walletBalanceContainerStyle = {
  padding: '20px',
  background: 'white',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const walletBalanceStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#0070BA',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
};

const topUpButtonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '30px',
  marginLeft: '10px',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'background-color 0.3s',
};

const transferButtonStyle = {
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '30px',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'background-color 0.3s',
};

const accountNumberContainerStyle = {
  color: 'black',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

const accountNumberStyle = {
  color: '#0070BA',
  fontSize: '18px',
  marginRight: '20px',
};

const recentTransactionsStyle = {
  padding: '20px',
  background: 'white',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  marginTop: '20px',
};

const transactionTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderStyle = {
  backgroundColor: '#f5f5f5',
};

const tableCellStyle = {
  padding: '15px 10px',
  borderBottom: '1px solid #ccc',
  color: '#3D424A',
  textAlign: 'left',
};

const HomePage = () => {
  const { setAccessToken } = useUser();
  const navigate = useNavigate();

  const [isLoadingTopUp, setIsLoadingTopUp] = useState(false);
  const [walletData, setWalletData] = useState({ wallet: { balance: '0.00' }, transactions: [] });

  useEffect(() => {
    // Retrieve the access token from the TokenManager
    const storedAccessToken = TokenManager.getToken();

    if (!storedAccessToken) {
      navigate('/login');
      return;
    }

    setAccessToken(storedAccessToken);

    const apiUrl = 'https://100088.pythonanywhere.com/api/wallet/v1/wallet_detail';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWalletData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleTopUp = () => {
    setIsLoadingTopUp(true);

    setTimeout(() => {
      navigate('/deposit');
      setIsLoadingTopUp(false);
    }, 1000);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <img src={logoImage} alt="Dowell wallet" style={logoStyle} />
        <div style={navBarStyle}>
          <div>
            <Link to="/profile" style={navItemStyle}>
              Profile
            </Link>
          </div>
          <div>
            <span style={navItemStyle} onClick={handleLogout}>
              Logout
            </span>
          </div>
        </div>
      </header>
      <div style={accountNumberContainerStyle}>
        <span style={accountNumberStyle}>
          Account: {walletData.wallet.account_no}
        </span>
      </div>
      <div style={walletBalanceContainerStyle}>
        <div style={walletBalanceStyle}>${walletData.wallet.balance}</div>
        <div style={buttonContainerStyle}>
          {isLoadingTopUp ? (
            <Loader />
          ) : (
            <button onClick={handleTopUp} style={topUpButtonStyle} disabled={isLoadingTopUp}>
              Top Up
            </button>
          )}
          <Link to="/transfer" style={transferButtonStyle}>
            Transfer
          </Link>
        </div>
      </div>
      <div style={recentTransactionsStyle}>
        <table style={transactionTableStyle}>
          <thead style={tableHeaderStyle}>
            <tr>
              <th style={tableCellStyle}>Date</th>
              <th style={tableCellStyle}>Description</th>
              <th style={tableCellStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {walletData.transactions.map((transaction, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{transaction.timestamp}</td>
                <td style={tableCellStyle}>{transaction.transaction_type}</td>
                <td style={tableCellStyle}>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
