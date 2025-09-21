import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pagesPassenger/Login";
import VerifyEmail from "./pagesPassenger/VerifyEmail";
import EmailVerified from "./pagesPassenger/EmailVerified";
import ForgotPassword from "./pagesPassenger/ForgotPassword";
import ResetPassword from "./pagesPassenger/ResetPassword";
import ResendVerifyEmail from "./pagesPassenger/ResendVerifyEmail";
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/resend-verify-email" element={<ResendVerifyEmail />} />
    </Routes>
  );
};

export default App;
