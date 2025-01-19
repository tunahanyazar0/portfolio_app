import React from 'react';
import { Drawer, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from '@mui/icons-material';

const Sidebar = ({ isOpen, toggleSidebar, fields, onNavigate }) => {
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
        <List>
          {fields.map((field) => (
            <ListItem button key={field.id} onClick={() => onNavigate(field.id)}>
              <ListItemText primary={field.label} />
            </ListItem>
          ))}
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
