import axios from 'axios';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Authentication_backend_url = 'http://localhost:8000';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${Authentication_backend_url}/auth/login`, {
        username,
        password
      });
      // response.data has 2 field: access_token and token_type
      console.log(response.data.access_token.sub)
      // token varsa set le
      if (response.data.access_token) {
        // bunu set etmez isek login olarak kalmayız!
        localStorage.setItem('user', JSON.stringify(response.data));
      } 
      /*
      Bu tokenden username ve role bilgisine ulaşmak için token i decode etmeliyiz çünkü 
      bu bilgiler token içine gömülü:

      Here is how to decode it:
      import jwtDecode from 'jwt-decode';

      // Assuming you have the token stored in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
          const decodedToken = jwtDecode(user.token);
          
          // Access username and role
          const username = decodedToken.sub; // Assuming 'sub' contains the username
          const role = decodedToken.role; // Assuming 'role' is also in the token

          console.log('Username:', username);
          console.log('Role:', role);
      } else {
          console.log('User is not logged in');
      }
      */

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${Authentication_backend_url}/auth/register`, {
        username: userData.username || userData.email, // Using email as username if no username provided
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: 'user' // Default role for new registrations
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // bu user anlık olarak logged in mi diye check etmek için
  // user logged in ise yani token i local storage de anlık olarak varsa demekki logged in
  // user logged out olunca local storage den datası atılıcak (token, data içinde token keyword ünün value sü)
  isLoggedIn: () => {
    const user = authService.getCurrentUser();
    return !!user?.token; // returns true if user exists and has token
  }, 

  logout: () => {
    localStorage.removeItem('user');
  }
};

export default authService;

/*
Local Storage de ne tutuyoruz?

login olduktan sonra:

// Example of what's in localStorage after login
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...", // JWT token
  "user": {
    "username": "johndoe",
    "role": "user",
    // other user data...
  }
}


auth dan sonra api.js de service lere call atarken bu token i şöyle kullanıcaz:

import axios from 'axios';

// Create axios instance with auth header interceptor
const api = axios.create();

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});


Then you can use this configured axios instance for protected routes:

import api from './api';

const someService = {
  getProtectedData: async () => {
    try {
      const response = await api.get('/api/protected-route');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // The token is automatically included in the Authorization header
  postProtectedData: async (data) => {
    try {
      const response = await api.post('/api/protected-route', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

This setup allows you to:
Store the authentication token securely
Automatically include it in API requests
Access user information (like role) for conditional rendering
Maintain the user's session until they logout or the token expires
*/