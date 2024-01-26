import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const onGooglePayLoaded = () => {
      // Replace 'your_merchant_id' with your actual Braintree merchant ID
      const merchantId = 'BCR2DN4T6HPJPIRV';

      // Create a Google Pay client
      const googlePayClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST', // Use 'TEST' for testing, 'PRODUCTION' for production
        merchantInfo: {
          merchantId: merchantId,
          merchantName: 'Your Merchant Name',
        },
        allowedPaymentMethods: ['CARD'],
        cardRequirements: {
          allowedCardNetworks: ['VISA', 'MASTERCARD'],
        },
      });

      // Create Google Pay button and attach a click event listener
      const googlePayButton = document.getElementById('google-pay-button');
      googlePayButton.addEventListener('click', () => {
        // Request payment data
        googlePayClient.loadPaymentData({
          allowedPaymentMethods: ['CARD'],
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '1.00', // Total amount in the smallest currency unit (e.g., cents)
            currencyCode: 'USD',
          },
        })
        .then(paymentData => {
          // Extract the payment method nonce from the payment data
          const paymentMethodNonce = paymentData.paymentMethodData.tokenizationData.token;

          // Send the payment method nonce to the backend API
          sendPaymentNonceToBackend(paymentMethodNonce);
        })
        .catch(error => {
          console.error('Error loading payment data:', error);
        });
      });

      // Function to send the payment nonce to the backend API
      const sendPaymentNonceToBackend = (paymentMethodNonce) => {
        // Make a POST request to your backend API endpoint
        fetch('http://127.0.0.1:8000/api/googlepay/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method_nonce: paymentMethodNonce,
            price: '1.00', // Same as the total price used in the payment data request
          }),
        })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the backend
          console.log(data);
          // You can perform additional actions based on the backend response
        })
        .catch(error => {
          console.error('Error sending payment nonce to backend:', error);
        });
      };
    };

    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.onload = onGooglePayLoaded;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <button id="google-pay-button">Pay with Google Pay</button>
    </div>
  );
}

export default App;
