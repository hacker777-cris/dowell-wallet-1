import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
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
  const { setSessionId } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook to access location

  const [isLoadingTopUp, setIsLoadingTopUp] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [walletData, setWalletData] = useState({ wallet: { balance: '0.00' }, transactions: [] });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const sessionId = urlSearchParams.get('session_id');
  
    setSessionId(sessionId);
  
    const apiUrl = `https://100088.pythonanywhere.com/api/wallet/v1/wallet_detail?session_id=${sessionId}`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setWalletData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [location.search, setSessionId]);
  

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleTopUp = () => {
    setIsLoadingTopUp(true);

    setTimeout(() => {
      setShowPaymentOptions(true); // Display payment options when "Top Up" is clicked
      setIsLoadingTopUp(false);
    }, 1000);
  };

  const handlePaymentMethod = (method) => {
    navigate(`/deposit?method=${method}`); // Navigate to /deposit with the chosen payment method
    setShowPaymentOptions(false); // Hide payment options after selecting a method
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
            <Link to="/settings" style={navItemStyle}>
              Settings
            </Link>
            </div>
            {/* <div>
            <Link to="/request" style={navItemStyle}>
              Requests
            </Link>
            </div> */}
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
          {/* <Link to="/transfer" style={transferButtonStyle}>
            Transfer
          </Link> */}
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
      {showPaymentOptions && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', zIndex: '999', textAlign: 'center' }}>
          <h2>Choose Payment Method</h2>
          <button onClick={() => handlePaymentMethod('paypal')} style={{ marginRight: '10px' }}>PayPal</button>
          <button onClick={() => handlePaymentMethod('stripe')} style={{ marginRight: '10px' }}>Stripe</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
