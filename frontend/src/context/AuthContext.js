// To manage authentication state globally: AuthContext.py
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// 1. Create a context
const AuthContext = createContext({
  user: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});


/*
auth context olayı şu:

Herhangi bir page de şu şekilde çağırıcaz:
const { user, userId, logout } = useAuth();
veya hepsini çağırmak istemiyorsak:
const { userId } = useAuth();
veya hepsi:
const { user, userId, login, logout} = useAuth();
-> bu return kısmında value içindeki değerlerin karşılığı oluyor.
veya:
const { userId } = useAuth();


user ve userId, context içindeki user ve userId state'lerini temsil ediyor.

Bu sayede her component de user ve userId state'lerini tekrar tekrar tanımlamamıza gerek kalmıyor.
Ayrıca bu login ve log out functionları nı da direkt kullanabiliyoruz.

Kullanmak için:
import { useAuth } from './context/AuthContext';

*/

// 2. Create a provider component for context
export const AuthProvider = ({ children }) => {
  // user contains user data if logged in: user_id, username, email, role 
  const [user, setUser] = useState(null); 
  const [userId, setUserId] = useState(null);
  // user data auth service kullanılarak çekilicek
  const [isLoading, setIsLoading] = useState(true);

  // await authService.getUserInformationByUsername(username); -> çünkü bu promise döndürüyor, await ile beklememiz gerekiyor.
  // await kullanınca userData artık bir promise olmuyor, direk user data oluyor, yani dictionary oluyor.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Extract the username from the token
        const username = authService.getUsernameFromToken();
  
        if (username) {
          // Fetch user data by username
          const userData = await authService.getUserInformationByUsername(username); // Await the Promise
  
          if (userData) {
            setUser(userData);
            setUserId(userData.user_id);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // Ensure loading is set to false regardless of success or error
      }
    };
  
    fetchUserData();
  }, []);
  

  // 2. login: Function to set user data in context
  const login = () => {
    // userData is access_token, token_type
    const username = authService.getUsernameFromToken();
    const userData = authService.getUserInformationByUsername(username);
    setUser(userData);
    /*
      Login olduktan sonra userData, user a setleniyor yani user:
      user = {
        user_id: 1,
        username: "johndoe",
        email: "
        first_name: "John",
        last_name: "Doe",
        role: "user"
      */  
  };

  // 3. logout: Function to clear user data
  const logout = () => {
    authService.logout(); // Removes from localStorage
    setUser(null); // Clears from context
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);