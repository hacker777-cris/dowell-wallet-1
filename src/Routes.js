import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Transfer from './components/Transfer';
import Profile from './components/Profile';
import UpdateProfile from './components/UpdateProfile';
import Deposit from './components/Deposit';
import Otpverification from './components/Otpverification';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="otp-verification" element={<Otpverification/>}/>
      <Route path="transfer" element={<Transfer />} />
      <Route path="profile" element={<Profile />} />
      <Route path="update-profile" element={<UpdateProfile />} />
      <Route path="deposit" element={<Deposit />} />
    </Routes>
  );
}

export default AppRoutes;