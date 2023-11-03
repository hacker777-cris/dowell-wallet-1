import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState(''); // Add the email state

  return (
    <UserContext.Provider value={{ accessToken, setAccessToken, email, setEmail }}> {/* Include email and setEmail */}
      {children}
    </UserContext.Provider>
  );
};

