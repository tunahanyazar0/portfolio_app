import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Avatar, CircularProgress } from '@mui/material';
import authService from '../services/authService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = await authService.getUsernameFromToken();
        const userData = await authService.getUserInformationByUsername(username);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 3,
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: (theme) =>
            `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
        }}
      >
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={3}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                backgroundColor: 'white',
                color: 'primary.main',
                fontSize: '2rem',
                fontWeight: 600,
              }}
            >
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body1" color="white" sx={{ opacity: 0.8 }}>
              @{user.username}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Contact Information
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pl: 1,
            }}
          >
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Username:</strong> {user.username}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
