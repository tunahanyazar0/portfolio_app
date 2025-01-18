import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

// Import your pages
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import Dashboard from './pages/dashboard';
import NotFound from './pages/NotFound'; // You should create this component
import StockPage from './pages/StockPage'; 

function AppContent() {
    return (
        <AuthProvider>
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

                    {/* Protected Routes */}
                    <Route 
                        path="/stocks/:symbol" 
                        element={
                            <PrivateRoute>
                                <StockPage />
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
    );
}

export default AppContent;