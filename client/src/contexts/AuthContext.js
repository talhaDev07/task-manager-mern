import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Use environment variable with fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set auth token in headers
        setAuthToken(token);
        
        const res = await axios.get(`${API_BASE_URL}/users/me`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      // Load user data
      const userRes = await axios.get(`${API_BASE_URL}/users/me`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return { error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      // Load user data
      const userRes = await axios.get(`${API_BASE_URL}/users/me`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return { error: err.response?.data?.msg || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set auth token in headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};