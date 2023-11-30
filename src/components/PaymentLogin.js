import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming React Router is used

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initializationId, setInitializationId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control confirmation dialog
  const [price, setPrice] = useState(0); // State to hold the price
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

 
useEffect(() => {
  // Extract initiation_id and price from URL params
  const searchParams = new URLSearchParams(location.search);
  const initializationIdFromParams = searchParams.get('initialization_id');
  const priceFromParams = searchParams.get('price'); // Extract price from URL params
  console.log('initialization ID from URL:', initializationIdFromParams);
  console.log('Price from URL is:', priceFromParams);



  if (initializationIdFromParams) {
    setInitializationId(initializationIdFromParams);
    // Set the price from URL params to state
    if (priceFromParams) {
      setPrice(parseFloat(priceFromParams)); // Convert to a number if needed
    }
  }
}, [location.search]);
  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmationSubmit = async () => {
    setIsLoading(true); // Set loading state to true during payment processing
    setShowConfirmation(false); // Hide confirmation dialog
    try {
      // Proceed with the POST request after confirmation
      const response = await fetch('http://127.0.0.1:8000//api/wallet/v1/authorize-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_password: password,
          initialization_id: initializationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error || 'Unknown error');
        return;
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error('No callback URL received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }finally {
      setIsLoading(false); // Set loading state back to false after payment processing is complete
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Login</h2>
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          margin: '0 auto',
        }}
      >
        {/* <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        /> */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Authorize Payment
        </button>
      </form>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg mb-4">Confirm payment of ${price}?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmationSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 focus:outline-none"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
      </div>
    )}
    </div>
    
  );
};

export default LoginForm;
