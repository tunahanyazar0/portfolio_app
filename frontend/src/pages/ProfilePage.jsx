import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Avatar, 
  CircularProgress,
  Paper,
  Divider,
  Grid,
  IconButton,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { 
  Email, 
  AccountCircle, 
  Dashboard, 
  ShowChart, 
  Person, 
  Folder, 
  Business, 
  List,
  Star,
  Settings,
  Notifications,
  WatchLater,
  PieChart
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  /*
    user is sth like:
    {
      "id": 1,
      "username": "admin",
      "first_name": "admin",
      "last_name": "admin",
      "email": ""
  */
  const navigate = useNavigate();

  const navigationItems = [
    { title: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { title: 'All Stocks', icon: <ShowChart />, path: '/stocks' },
    { title: 'Portfolios', icon: <PieChart />, path: '/portfolios' },
    { title: 'Sectors', icon: <Business />, path: '/sectors' },
    { title: 'Watchlists', icon: <WatchLater />, path: '/watchlists' },
  ];

  const recentActivity = [
    { action: 'Added AAPL to Watchlist', time: '2 hours ago' },
    { action: 'Updated Tech Portfolio', time: '1 day ago' },
    { action: 'Viewed Energy Sector', time: '2 days ago' },
  ];

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Profile Info - One grid for that */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            {/* Header Background */}
            <Box
              sx={{
                height: 100,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            />

            {/* Profile Content */}
            <Box sx={{ px: 3, pb: 3, mt: -5 }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid white',
                    boxShadow: 3,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mb: 2,
                  }}
                >
                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  @{user.username}
                </Typography>

                <Box sx={{ mt: 2, width: '100%' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <IconButton size="small" sx={{ mr: 1, color: 'primary.main' }}>
                      <Email />
                    </IconButton>
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={3} sx={{ borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Button
              startIcon={<Settings />}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            >
              Account Settings
            </Button>
            <Button
              startIcon={<Notifications />}
              variant="outlined"
              fullWidth
            >
              Notification Preferences
            </Button>
          </Paper>
        </Grid>

        {/* Right Column - Navigation and Activity */}
        <Grid item xs={12} md={8}>
          {/* Navigation Cards */}
          <Paper elevation={3} sx={{ borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Navigation</Typography>
            <Grid container spacing={2}>
              {navigationItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.path}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <IconButton size="small" sx={{ color: 'primary.main', mr: 1 }}>
                          {item.icon}
                        </IconButton>
                        <Typography variant="subtitle1">{item.title}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Activity */}
          <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">{activity.action}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;