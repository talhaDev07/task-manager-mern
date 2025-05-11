import { createContext, useState, useEffect } from 'react';
import api from './api'; // import the axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await api.post('/users/register', formData);
      localStorage.setItem('token', res.data.token);

      const userRes = await api.get('/users/me');
      setUser(userRes.data);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      return { error: err?.response?.data?.msg || 'Registration failed' };
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/users/login', formData);
      localStorage.setItem('token', res.data.token);

      const userRes = await api.get('/users/me');
      setUser(userRes.data);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      return { error: err?.response?.data?.msg || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
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
