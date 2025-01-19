import React from 'react';
import { Drawer, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, fields, onNavigate }) => {
  // at the top of the sidebar, there will be choice of fields to navigate to /dashboard
  return (
    <>
      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>        
        {/* List of Fields */}
        <List>
          {fields.map((field) => (
            <ListItem button key={field.id} onClick={() => onNavigate(field.id)}>
              <ListItemText primary={field.label} />
            </ListItem>
          ))}
          {/* Navigation to Dashboard */}
        <ListItem button component={Link} to="/dashboard" sx={{ color: 'red' }}>
            <ListItemText primary="Dashboard" />
        </ListItem>
        </List>
      </Drawer>

      {/* Toggle Button to Open Sidebar */}
      {!isOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{ position: 'fixed', left: 16, top: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
