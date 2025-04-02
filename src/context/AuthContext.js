import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  const navigate = useNavigate()
  const location = useLocation()

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    const redirectPath = location.state?.from?.pathname || "/foryou";
    navigate(redirectPath, { replace: true });
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
