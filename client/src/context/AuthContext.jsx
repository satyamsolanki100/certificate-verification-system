import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // 🔥 no blocking
  const navigate = useNavigate();

  // ❌ REMOVE /auth/me (not in backend)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // simple session
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/api/auth/login", credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setUser(data.user || { email: credentials.email });

      // 🔥 IMPORTANT
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
