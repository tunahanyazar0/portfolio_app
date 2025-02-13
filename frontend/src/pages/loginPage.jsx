import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.username, formData.password);
      login();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome Back
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              error={touched.username && !formData.username}
              helperText={touched.username && !formData.username ? 'Username is required' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.01)',
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !formData.password}
              helperText={touched.password && !formData.password ? 'Password is required' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.01)',
                  },
                },
              }}
            />

            {error && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                position: 'relative',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      mr: 1,
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Signing in...
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link href="#" variant="body2" sx={{ 
                color: theme.palette.primary.main,
                transition: 'color 0.2s',
                '&:hover': { color: theme.palette.primary.dark },
              }}>
                Forgot password?
              </Link>
              <Link href="/register" variant="body2" sx={{ 
                color: theme.palette.primary.main,
                transition: 'color 0.2s',
                '&:hover': { color: theme.palette.primary.dark },
              }}>
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;