import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PaymentLogin from './components/PaymentLogin';
import Profile from './components/Profile';
import UpdateProfile from './components/UpdateProfile';
import Deposit from './components/Deposit';
import PasswordReset from './components/PasswordReset';
import Settings from './components/Settings';
import DowellPay from './components/store';
import Otpverification from './components/Otpverification';
import PasswordResetPage from './components/PasswordReset';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="password-reset" element={<PasswordResetPage />} />
      <Route path="otp-verification" element={<Otpverification/>}/>
      <Route path="payment-login" element={<PaymentLogin/>} />
      <Route path="dowell-pay" element={<DowellPay />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="update-profile" element={<UpdateProfile />} />
      <Route path="deposit" element={<Deposit />} />
    </Routes>
  );
}

export default AppRoutes;
