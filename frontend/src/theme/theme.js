// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1372d1', // Blue color for primary actions
    },
    secondary: {
      main: '#ff4081', // Pink color for secondary actions
    },
    background: {
      default: '#f5f5f5', // Light grey background
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 500, // Header styling
    },
  },
});

export default theme;