import React, { useState, useEffect, useRef } from 'react';
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
  Slide,
} from '@mui/material';
import { AccountCircle, Search as SearchIcon, Close } from '@mui/icons-material';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    // Close search when menu opens
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setIsSearchOpen(query.trim() !== '');
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const handleStockSelect = (stock) => {
    setSearchQuery(''); // Reset the search input
    setIsSearchOpen(false);
    navigate(`/stocks/${stock.stock_symbol}`);
  };

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
      <Toolbar sx={{ height: 60, px: { xs: 2, sm: 4 } }}>
        {/* Logo */}
        <Button
          onClick={() => navigate('/dashboard')}
          sx={{
            padding: 0,
            background: 'transparent',
            '&:hover': {
              background: 'transparent',
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Z Investment
          </Typography>
        </Button>

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
                ref={searchInputRef}
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
              {(loading || (searchQuery && isSearchOpen)) && (
                <IconButton 
                  onClick={handleSearchClose}
                  sx={{ 
                    p: '10px', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    />
                  ) : (
                    <Close />
                  )}
                </IconButton>
              )}
            </Box>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <Slide direction="down" in={isSearchOpen} mountOnEnter unmountOnExit>
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    mt: 1,
                    zIndex: 1300,
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
                        onClick={() => handleStockSelect(stock)}
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
              </Slide>
            )}
          </Box>
        )}

        {/* User Menu */}
        {user && (
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
              TransitionComponent={Slide}
              TransitionProps={{ direction: 'down' }}
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
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/portfolios');
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Portfolios</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/stocks');
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Stocks</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/sectors');
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Sectors</Typography>
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;