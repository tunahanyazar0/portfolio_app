import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import theme from './theme/theme'; // Import your theme


// Import your pages
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import Dashboard from './pages/dashboard';
import NotFound from './pages/NotFound';
import StockPage from './pages/StockPage';
import ProfilePage from './pages/ProfilePage';
import PortfoliosPage from './pages/PortfoliosPage';
import PortfolioPage from './pages/PortfolioPage';
import AllSectorsPage from './pages/AllSectorsPage';
import SectorPage from './pages/SectorPage';
import AllStocksPage from './pages/AllStocksPage';
import WatchlistPage from './pages/WatchListPage';
import WatchListsPage from './pages/WatchListsPage';

// navbars are seen in all of the pages if the user is authenticated
// if the user is not authenticated, the user is redirected to the login page
import BottomNavbar from './components/BottomNavbar';
import Navbar from './components/Navbar';

// We want the WebSocket connection to remain active for authenticated users across all pages.
import WebSocketComponent from './components/WebSocketComponent';

function AppContent() {
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets browser styling */}
      <AuthProvider>
        <Navbar />
        <BottomNavbar />

        {<WebSocketComponent/>} {/* Run WebSocket only for authenticated users */}

        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/stocks/:symbol" 
              element={
                <PrivateRoute>
                  <StockPage />
                </PrivateRoute>
              } 
            />

            <Route
              path = "/profile"
              element = {
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path = "/portfolios"
              element = {
                <PrivateRoute>
                  <PortfoliosPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/portfolios/:id"
              element = {
                <PrivateRoute>
                  <PortfolioPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/sectors"
              element = {
                <PrivateRoute>
                  <AllSectorsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/sectors/:sectorId"
              element = {
                <PrivateRoute>
                  <SectorPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/stocks"
              element = {
                <PrivateRoute>
                  <AllStocksPage />
                </PrivateRoute>
              } 
            />

            <Route
              path="/watchlist/:watchlistId"
              element = {
                <PrivateRoute>
                  <WatchlistPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/watchlists"
              element = {
                <PrivateRoute>
                  <WatchListsPage/>
                </PrivateRoute>
              }
            />
            
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppContent;
