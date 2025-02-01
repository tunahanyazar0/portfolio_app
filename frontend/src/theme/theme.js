// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d', // Blue color for primary actions,
      900: '#1a365d', // Darkest blue
      800: '#2c5282',
      700: '#2b6cb0',
      600: '#3182ce',
      500: '#4299e1', // Main brand blue
      
    },
    secondary: {
      main: '#ff4081', // Pink color for secondary actions
    },
    background: {
      default: '#f5f5f5', // Light grey background
    },
    accent: {
      400: '#7f9cf5', // Complementary purple-blue
      300: '#a3bffa',
    },
    neutral: {
      900: '#1a202c', // Dark gray for text
      800: '#2d3748',
      700: '#4a5568',
      100: '#f7fafc', // Light background
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 500, // Header styling
    },
  },
});

export default theme; // this is the default export

/*
to use these colors in any component, you can use the following code:

import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme.palette.primary[900] }}>
      Hello World
    </div>
  );
}

*/