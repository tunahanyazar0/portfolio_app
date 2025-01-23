// in this page, there will be card with the preview of the portfolio and a button to view the portfolio in detail
// the card will have the following information:
// - title
// - description
// - pie chart of the portfolio
// - button to view the portfolio in detail

// for the card, we will call the ../components/Portfolio_Card.jsx component which uses the following props:
// - portfolio id (to link to the portfolio detail page)
// to get the info about the portfolios, we will call the ../services/portfolioService.js file which will have the following functions:
      

import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PortfolioCard from '../components/PortfolioCard';
import portfolioService from '../services/portfolioService';
import authService from '../services/authService';

const CreatePortfolioDialog = ({ 
  open, 
  onClose, 
  onCreatePortfolio 
}) => {
  const [portfolioName, setPortfolioName] = useState('');

  const handleCreate = () => {
    if (portfolioName.trim()) {
      onCreatePortfolio(portfolioName);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Portfolio</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Portfolio Name"
          fullWidth
          variant="outlined"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button 
          onClick={handleCreate} 
          color="primary" 
          variant="contained"
          disabled={!portfolioName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch user portfolios whenever the page loads
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const username = authService.getUsernameFromToken();
        const user = await authService.getUserInformationByUsername(username);
        const data = await portfolioService.getUserPortfolios(user.user_id);
        /*
          It returns an array of portfolios like this:
            [
                {
                    "portfolio_id": 1,
                    "user_id": 1,
                    "name": "My Portfolio",
                    "created_at": "2022-01-01T00:00:00Z"
                },
                {
                    "portfolio_id": 2,
                    "user_id": 1,
                    "name": "Tech Stocks",
                    "created_at": "2022-01-01T00:00:00Z"
                }, ...
      */
        setPortfolios(data);
      } catch (err) {
        setError('Failed to load portfolios. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Create a new portfolio for the user
  const handleCreatePortfolio = async (portfolioName) => {
    try {
      const username = authService.getUsernameFromToken();
      const user = await authService.getUserInformationByUsername(username);
      const userId = user.user_id;

      await portfolioService.createPortfolio(userId, portfolioName);
      
      setSnackbar({
        open: true,
        message: 'Portfolio created successfully!',
        severity: 'success'
      });

      const data = await portfolioService.getUserPortfolios(userId);
      setPortfolios(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create portfolio. Please try again.',
        severity: 'error'
      });
    }
  };

  // function to close the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading state
  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Normal state
  return (
    <Container>
      <Box 
        sx={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          marginTop: 3
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          My Portfolios
        </Typography>
        {/* Button to create a new portfolio */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create Portfolio
        </Button>
      </Box>

        {/* If there are no portfolios, show a message to create a new portfolio */}
      {portfolios.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            You haven't created any portfolios yet
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Your First Portfolio
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item key={portfolio.portfolio_id} xs={12} sm={6} md={6}>
              <PortfolioCard portfolio={portfolio} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog to create a new portfolio, bu normal bir component değil sadece belirli zamanlarda ortaya çıkıyor */}
      <CreatePortfolioDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreatePortfolio={handleCreatePortfolio}
      />

      {/* Snackbar to show success or error messages -> bazen ortaya çıkıyor bu yüzden jsx de konumu önemli değil */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      
    </Container>
  );
};

export default PortfoliosPage;