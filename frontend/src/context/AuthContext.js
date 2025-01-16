// To manage authentication state globally: AuthContext.py
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/*
Context in react:

Three main element of auth context:
user:
login:
logout: 

isLoading: 

These three:
- Maintain the user's authentication state
- Provide access to user data throughout the app
- Handle login/logout operations consistently
- Enable role-based access control


You can access them anywhere in your app using the useAuth hook:
import { useAuth } from '../context/AuthContext';

function SomeComponent() {
  const { user, login, logout } = useAuth();
  
  // Now you can use these values/functions
  if (user?.role === 'admin') {
    // Show admin features
  }
*/

export const AuthProvider = ({ children }) => {
  // 1. user: Stores the current user's data
  // Contains data like: { username, role, token, etc... }
  // Is null when no user is logged in
  /*
  example usage:
     const { user } = useAuth();
    if (user) {
      console.log(user.username); // Access user data
      console.log(user.role);     // Check user role
    }
  */
  const [user, setUser] = useState(null); 
  // user data auth service kullanılarak çekilicek
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const user = authService.getCurrentUser();
    setUser(user);
    setIsLoading(false);
  }, []);

  // 2. login: Function to set user data in context
  const login = (userData) => {
    setUser(userData);
  };

  // 3. logout: Function to clear user data
  const logout = () => {
    authService.logout(); // Removes from localStorage
    setUser(null); // Clears from context
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);