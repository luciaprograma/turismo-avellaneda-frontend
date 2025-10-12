import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pagesPassenger/Login";
import VerifyEmail from "./pagesPassenger/VerifyEmail";
import EmailVerified from "./pagesPassenger/EmailVerified";
import ForgotPassword from "./pagesPassenger/ForgotPassword";
import ResetPassword from "./pagesPassenger/ResetPassword";
import ResendVerifyEmail from "./pagesPassenger/ResendVerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import MainPagePassenger from "./pagesPassenger/MainPagePassenger";
import DetailExcursionPassenger from "./pagesPassenger/ExcursionDetailPassenger";
import Profile from "./pagesPassenger/Profile";
import ChangePassword from "./pagesPassenger/ChangePasswordPassenger";
import MyExcursions from "./pagesPassenger/MyExcursions";
import InformPayment from "./pagesPassenger/InformPayment";
import PaymentReceipts from "./pagesPassenger/PaymentReceipts";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/resend-verify-email" element={<ResendVerifyEmail />} />

      <Route
        path="/main-passenger"
        element={
          <ProtectedRoute>
            <MainPagePassenger />
          </ProtectedRoute>
        }
      />

      <Route
        path="/excursion/:id"
        element={
          <ProtectedRoute>
            <DetailExcursionPassenger />
          </ProtectedRoute>
        }
      />

      <Route
        path="/datos-personales"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-excursiones"
        element={
          <ProtectedRoute>
            <MyExcursions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/informar-pago/:registrationId"
        element={
          <ProtectedRoute>
            <InformPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ver-comprobantes/:registrationId"
        element={<PaymentReceipts />}
      />
    </Routes>
  );
};

export default App;
