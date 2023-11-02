import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes'; // Replace with your actual routes component
import { UserProvider } from './UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes />
      </UserProvider>
    </Router>
  );
}

export default App;
