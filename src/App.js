import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import privateRoutes from "./components/PrivateRoutes";
import MobileBottomNav from "./components/MobileBottomNav";


const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const hideSidebar = ["/login", "/signup", "/settings", "/live-stream"].includes(location.pathname);

  return (
    <div className="h-screen bg-white flex justify-between items-start">
      {!hideSidebar && isAuthenticated && <Sidebar />}

      <div className="w-full flex-grow lg:pt-0 pt-14">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes */} 
          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute element={element} />} />
          ))}
        </Routes> 

        {/* Show MobileBottomNav only on private routes */}
        {privateRoutes.some(route => window.location.pathname === route.path) && <MobileBottomNav />}
      </div>

    </div>
  );
}

export default App;