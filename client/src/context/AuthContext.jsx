import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';


const STORAGE_KEY = 'dobbyads:user';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

  const getCurrentUser = async () => {

    try {

      const res =
        await api.get('/auth/me');

      setUser(res.data.user);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

    }
  };

  getCurrentUser();

}, []);



 const login = async (credentials) => {

  const res =
    await api.post(
      '/auth/login',
      credentials
    );

  setUser(res.data.user);
};



const logout = async () => {

  await api.post('/auth/logout');

  setUser(null);
};

const signup = async (credentials) => {

  const res =
    await api.post(
      '/auth/signup',
      credentials
    );

  setUser(res.data.user);
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loading , signup}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);