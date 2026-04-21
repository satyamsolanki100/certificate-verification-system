import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicVerify from "./pages/PublicVerify";
import History from "./pages/History";
import IssueCertificate from "./pages/IssueCertificate";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase();

  return (
    <Routes>
      {/* ✅ PUBLIC ROUTES: Accessible by anyone */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<PublicVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 🔐 PROTECTED ROUTES: Login Required */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/history"
        element={isAuthenticated ? <History /> : <Navigate to="/login" />}
      />

      {/* 🔒 ADMIN/UNIVERSITY ONLY: Protected by Role Check */}
      <Route
        path="/issue"
        element={
          isAuthenticated &&
          (userRole === "admin" || userRole === "university") ? (
            <IssueCertificate />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* 🔒 ADMIN ONLY: Highly Restricted */}
      <Route
        path="/settings"
        element={
          isAuthenticated && userRole === "admin" ? (
            <Settings />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* 🔄 Catch-all: Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
