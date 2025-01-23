import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home, Business, BarChart, PieChart, AccountBox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNavbar = () => {
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
        navigate('/portfolios'); // Portfolio page
        break;
      case 4:
        navigate('/profile'); // Profile page
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 53,
        background: (theme) =>
          `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => handleNavigation(newValue)}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'white',
            },
            '&:hover': {
              color: 'white',
            },
          },
          background: 'transparent',
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Sectors" icon={<Business />} />
        <BottomNavigationAction label="Stocks" icon={<BarChart />} />
        <BottomNavigationAction label="Portfolio" icon={<PieChart />} />
        <BottomNavigationAction label="Profile" icon={<AccountBox />} />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNavbar;
