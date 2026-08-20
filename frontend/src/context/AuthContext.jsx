import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import i18n from '../i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/users/me')
        .then(res => {
          setUser(res.data);
          if (res.data.preferredLanguage) {
            i18n.changeLanguage(res.data.preferredLanguage);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    if (userData.preferredLanguage) {
      i18n.changeLanguage(userData.preferredLanguage);
    }
    return userData;
  };

  const register = async (name, email, password, preferredLanguage) => {
    const res = await api.post('/auth/register', { name, email, password, preferredLanguage });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    if (user) {
      api.put('/users/me', { preferredLanguage: lang })
        .then(res => setUser(res.data))
        .catch(err => console.error("Could not sync language preference", err));
    }
  };

  const isAdmin = user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, changeLanguage, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
