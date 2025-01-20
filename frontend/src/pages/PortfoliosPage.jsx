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
} from '@mui/material';
import PortfolioCard from '../components/PortfolioCard';
import portfolioService from '../services/portfolioService';
import authService from '../services/authService';

// Extracted Header Component
const PageHeader = ({ title, subtitle }) => (
  <Box
    sx={{
      textAlign: 'center',
      marginBottom: '2rem',
      marginTop: '2rem',
      padding: '1.5rem 0',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #007FFF, #0056B3)',
      color: '#fff',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: 700,
        letterSpacing: '1px',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      {title}
    </Typography>
  </Box>
);

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const username = authService.getUsernameFromToken();
        const user = await authService.getUserInformationByUsername(username);
        const userId = user.user_id;
        const data = await portfolioService.getUserPortfolios(userId);
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

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="Portfolios"
      />
      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item key={portfolio.portfolio_id} xs={12} sm={6} md={6}>
            <PortfolioCard portfolio={portfolio} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PortfoliosPage;
