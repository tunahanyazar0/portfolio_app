import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import { Home, Business, BarChart, PieChart, AccountBox, WatchLater, Dashboard, ShowChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the user from AuthContext

  // If the user is not authenticated, do not render the navbar
  if (!user) {
    return null;
  }

  const handleNavigation = (newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard'); // Home
        break;
      case 1:
        navigate('/sectors'); // Sectors page
        break;
      case 2:
        navigate('/stocks'); // Stocks page
        break;
      case 3:
        navigate('/watchlists'); // Watchlists page
        break;
      case 4:
        navigate('/portfolios'); // Portfolio page
        break;
      case 5:
        navigate('/profile'); // Profile page
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="sticky" sx={{ top: 0, background: (theme) => `linear-gradient(to right, ${theme.palette.primary[700]}, ${theme.palette.primary.main})` }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <IconButton onClick={() => handleNavigation(0)} sx={{ color: value === 0 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <Dashboard />
          <Typography variant="body2" sx={{ color: value === 0 ? 'white' : 'rgba(255, 255, 255, 0.7)', marginLeft: '2px' }}>
            Dashboard
          </Typography>
        </IconButton>
        
        <IconButton onClick={() => handleNavigation(1)} sx={{ color: value === 1 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <Business />
          <Typography variant="body2" sx={{ color: value === 1 ? 'white' : 'rgba(255, 255, 255, 0.7)' , marginLeft: '2px'}}>
            Sectors
          </Typography>
        </IconButton>
        
        <IconButton onClick={() => handleNavigation(2)} sx={{ color: value === 2 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <ShowChart />
          <Typography variant="body2" sx={{ color: value === 2 ? 'white' : 'rgba(255, 255, 255, 0.7)', marginLeft: '2px' }}>
            Stocks
          </Typography>
        </IconButton>
        
        <IconButton onClick={() => handleNavigation(3)} sx={{ color: value === 3 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <WatchLater />
          <Typography variant="body2" sx={{ color: value === 3 ? 'white' : 'rgba(255, 255, 255, 0.7)', marginLeft: '2px' }}>
            Watchlists
          </Typography>
        </IconButton>
        
        <IconButton onClick={() => handleNavigation(4)} sx={{ color: value === 4 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <PieChart />
          <Typography variant="body2" sx={{ color: value === 4 ? 'white' : 'rgba(255, 255, 255, 0.7)', marginLeft: '2px' }}>
            Portfolio
          </Typography>
        </IconButton>
        
        <IconButton onClick={() => handleNavigation(5)} sx={{ color: value === 5 ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
          <AccountBox />
          <Typography variant="body2" sx={{ color: value === 5 ? 'white' : 'rgba(255, 255, 255, 0.7)', marginLeft: '2px' }}>
            Profile
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
