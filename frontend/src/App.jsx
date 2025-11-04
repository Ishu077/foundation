import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import History from './pages/History.jsx';
import Pagenotfound from './Pagenotfound.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-info');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Signup onSignup={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute 
              element={<Dashboard onLogout={handleLogout} />} 
            />
          } 
        />
        <Route 
          path="/history" 
          element={
            <PrivateRoute 
              element={<History onLogout={handleLogout} />} 
            />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
