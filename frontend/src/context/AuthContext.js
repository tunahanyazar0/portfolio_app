// To manage authentication state globally: AuthContext.py
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/*
Context in react:

1. **user**: This usually holds the information about the currently authenticated user. 
It can include details like the user's ID, name, email, and any other relevant 
data that you might need throughout your application.

2. **login**: This is a function that is responsible for authenticating a user. 
It typically takes user credentials (like username and password), 
sends them to an authentication service (like an API), and if successful, 
updates the `user` state with the authenticated user's information.

3. **logout**: This function is used to log the user out of the application. 
It usually clears the user state and may also involve removing any 
authentication tokens stored in local storage or cookies.

4. **isLoading**: This boolean value indicates whether the authentication process
 is currently in progress. It can be useful for showing loading indicators
  in the UI while the login or logout process is happening.



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