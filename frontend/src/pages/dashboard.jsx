import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const isLoggedIn = true; // Replace with your actual auth logic
  const userName = 'John Doe'; // Replace with the logged-in user's name

  const handleLogout = () => {
    console.log('Logged out');
    // Implement your logout logic here
  };

  const handleSearch = (query) => {
    console.log(`Searching for ${query}`);
    // Implement your API call or search logic here
  };

  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <div>
        {/* Dashboard Content */}
        <h1>Welcome to the Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
