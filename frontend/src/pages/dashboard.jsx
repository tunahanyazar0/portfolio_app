import React from 'react';
// to get username of the user
import authService from '../services/authService';


const Dashboard = () => {
  // get current user
  const username = authService.getUsernameFromToken();
  console.log(username);
  return (
    <div>
      <div>
        {/* Dashboard Content */}
        <h1>Welcome, {username}</h1>
      </div>
    </div>
  );
};

export default Dashboard;
