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
  Popover,
  Badge
} from '@mui/material';
import { AccountCircle, Search as SearchIcon, Close } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import stockService from '../services/stockService';
// for notification
import { Notifications as NotificationsIcon } from "@mui/icons-material";


// One cons of having a web connection in the navbar is that connection is re-established every time the user navigates to a new page
// This is not a big deal for small applications, but for larger applications, it can be a performance issue. 
// For that reason, it is better to have a WebSocket connection in a separate component that is always rendered, such as the App component.
// We can do it later. We might pull the notifications in the app content and then pass it to here, navbar.

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // anchorEl is used to position the user dropdown menu
  // if anchorEl is null, the menu is closed
  // if anchorEl is set to the button element, the menu is opened
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // for notifications
  // to keep the notifications and unread count
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Count of unread notifications
  const socketRef = useRef(null); // Store the WebSocket connection
  // this anchorEl is used to position the notifications popover
  // if anchorEl is null, the popover is closed; if it is set to the button element, the popover is opened
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // For notifications


  useEffect(() => {
    if (!user) return;

    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8002/ws/" + user.user_id);
      console.log("Connecting WebSocket...");

      socketRef.current.onmessage = (event) => {
        console.log("New message:", event.data);
        setNotifications((prev) => {
          const newNotifications = [event.data, ...prev].slice(0, 10);
          return newNotifications;
        });
        
        // increment the unread count
        setUnreadCount((prev) => prev + 1);
      };

      console.log("nofications", notifications);

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected ❌ Reconnecting...");
        setTimeout(connectWebSocket, 3000);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        socketRef.current.close();
      };
    };

    connectWebSocket();
    return () => socketRef.current?.close();
  }, [user]);

  const handleOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setAnchorEl(null); // Close user menu when opening notifications
    setUnreadCount(0); // Mark as read when opened
  };

  const handleClose = () => setNotificationAnchorEl(null);
  // end of the notification part


  
  const handleMenuOpen = (event) => {
    // open the user menu
    setAnchorEl(event.currentTarget);
    // Close notifications when menu opens 
    setNotificationAnchorEl(null);
    // Close search when menu opens
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // close the user menu by setting anchorEl to null
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


  // notifications part


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

        {/* Notifications */}
        {user && (
          <IconButton color="inherit" onClick={handleOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}

        {/* Notifications Popover */}
        {/* anchor el allows us to open and close the drop down menu: if null it means closed, if not, it opens the event.target */}
        <Popover
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Paper sx={{ width: 300, maxHeight: 600, overflowY: "auto" }}>
            <List>
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={notif} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              )}
            </List>
            {/* Text if this is clicked, notifications are cleared */}
            <Button
              onClick={() => {
                setNotifications([]);
                setUnreadCount(0);
              }}
              sx={{ width: "100%" }}
            >
              <Typography variant="body2" sx={{ color: "error.main" }}>
                Clear Notifications
              </Typography>
            </Button>
          {/* End of the notifications popover - Paper çevresinde belirli bir border var! */}
            
          </Paper>
        </Popover>


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