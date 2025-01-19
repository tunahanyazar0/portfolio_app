import React from 'react';
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
  alpha,
} from '@mui/material';
import { AccountCircle, Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== '') {
      onSearch(searchQuery);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
            Z Investment
        </Typography>

        {/* Search Bar */}
        {user && (
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              maxWidth: '50%',
              marginX: 2,
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
              },
            }}
          >
            <IconButton
              sx={{
                p: '10px',
                color: 'common.white',
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search Stocks..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '8px 16px',
                  color: 'common.white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        )}

        {/* User Menu */}
        {user ? (
          <Box>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius,
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <AccountCircle sx={{ mr: 1 }} />
              <Typography variant="body1">{user.username}</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1,
                  },
                },
              }}
            >
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/portfolio')}>Portfolio</MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                }}
                sx={{ color: 'error.main' }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
