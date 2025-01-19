import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  alpha,
  Fade,
} from '@mui/material';
import { AccountCircle, Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import stockService from '../services/stockService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const results = await stockService.searchStocks(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: (theme) => `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ height: 70, px: { xs: 2, sm: 4 } }}>
        {/* Logo */}
        <Typography href="/dashboard"
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: { xs: 1, sm: 3 }
          }}
        >
          Z Investment
        </Typography>

        {/* Search Bar */}
        {user && (
          <Box sx={{ 
            position: 'relative', 
            flexGrow: 1, 
            maxWidth: 600,
            mx: 'auto'
          }}>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '12px',
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.07),
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
                '&:focus-within': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <IconButton sx={{ 
                p: '10px', 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: 'white' }
              }}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search Stocks..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  color: 'white',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '10px 16px',
                    fontSize: '0.95rem',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  },
                }}
              />
              {loading && (
                <Fade in={loading}>
                  <CircularProgress
                    size={24}
                    sx={{
                      mr: 2,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  />
                </Fade>
              )}
            </Box>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <Paper
                elevation={8}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  zIndex: 1300, // Ensures the dropdown is above other elements
                  borderRadius: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: 'background.paper',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <List sx={{ py: 1 }}>
                  {searchResults.map((stock) => (
                    <ListItem
                      button
                      key={stock.stock_symbol}
                      onClick={() => {
                        setSearchQuery(''); // Reset the search input
                        navigate(`/stocks/${stock.stock_symbol}`);
                      }}
                      sx={{
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {stock.name} 
                            <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 600 }}>
                              ({stock.stock_symbol})
                            </Typography>
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Market Cap: {stock.market_cap}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        )}

        {/* User Menu */}
        {user ? (
          <Box sx={{ ml: { xs: 1, sm: 3 } }}>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <AccountCircle sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.username}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  },
                },
              }}
            >
              <MenuItem onClick={() => navigate('/profile')}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/portfolio')}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Portfolio</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                  navigate('/login');
                }}
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.lighter',
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Log Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
            null
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;