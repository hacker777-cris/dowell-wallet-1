import React, { useState } from 'react';
import Iphoneimage from '../images/iphone.jpg' ;
import Samsungimage from '../images/samsung.jpg' ;
import Laptopimage from '../images/laptop.jpg' ;

const Store = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: 'Iphone', price: 20, currency: 'USD', image: Iphoneimage },
    // Add other products with their respective image paths
    { id: 2, name: 'Samsung', price: 30, currency: 'USD', image: Samsungimage },
    { id: 3, name: 'Laptop', price: 40, currency: 'EUR', image: Laptopimage },
  ];

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  const handlePayment = async () => {
    const { price, currency } = selectedProduct;
    const currentUrl = window.location.href;

    try {
      const response = await fetch('api/wallet/v1/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          currency,
          callback_url: currentUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful initialization
        console.log('Initialization successful:', data);
        if (data.redirect_url) {
          // Redirect the user to the received URL
          window.location.href = data.redirect_url;
        } else {
          console.error('No redirect URL received');
          // Handle this case accordingly
        }
      } else {
        // Handle unsuccessful response
        console.error('Initialization failed:', response.statusText);
      }
    } catch (error) {
      // Handle error
      console.error('Initialization error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <h2>Dowell Store</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ margin: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '15px', width: '200px' }}>
            <div style={{ width: '100%', height: '150px', overflow: 'hidden', marginBottom: '10px' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3>{product.name}</h3>
            <p>Price: {product.price} {product.currency}</p>
            <button
              onClick={() => handleBuyClick(product)}
              style={{
                padding: '8px 16px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#3498db',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f7f7f7',
            padding: '20px',
            border: '1px solid #ccc',
            zIndex: '999',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>Confirm Payment</h3>
          <p>
            You are about to buy {selectedProduct.name} for {selectedProduct.price} {selectedProduct.currency}
          </p>
          <button
            onClick={handlePayment}
            style={{
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#3498db',
              color: 'white',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Pay with Dowell Wallet
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#e74c3c',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Store;
