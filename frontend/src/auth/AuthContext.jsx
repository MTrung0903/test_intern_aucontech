import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({ token: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    
    const isFirstLoad = !sessionStorage.getItem('app_loaded');
    
    if (isFirstLoad) {
     
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        localStorage.removeItem('token');
       
      }
      
      sessionStorage.setItem('app_loaded', 'true');
      return null;
    } else {
      
      return localStorage.getItem('token');
    }
  });

  const login = (t) => {
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


