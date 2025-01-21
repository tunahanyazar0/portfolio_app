import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import PortfolioCard from '../components/PortfolioCard'; // Import portfolio card component
import SectorCard from '../components/SectorCard'; // Import sector card component
import stockService from '../services/stockService'; // Import stock services

const Homepage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for portfolios, sectors, and news
        const portfoliosData = await stockService.getAllStocksDetailed();
        const sectorsData = await stockService.getAllSectors();
        // Fetch news from an external API or backend
        const newsData = await fetchStockNews();
        setPortfolios(portfoliosData.slice(0, 3)); // Limit to top 3 portfolios
        setSectors(sectorsData.slice(0, 3)); // Limit to top 3 sectors
        setNews(newsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStockNews = async () => {
    // Placeholder for news fetching logic
    // Replace with API call to NewsAPI or custom backend
    return [
      {
        title: 'Stock Market Reaches New Highs',
        description: 'The stock market has hit an all-time high with major indices rising significantly.',
        url: 'https://example.com/news1',
      },
      {
        title: 'Tech Stocks Lead Gains',
        description: 'Tech companies outperformed expectations, driving market growth.',
        url: 'https://example.com/news2',
      },
      {
        title: 'Economic Outlook Remains Positive',
        description: 'Experts predict steady growth in the economy as markets stabilize.',
        url: 'https://example.com/news3',
      },
    ];
  };

  return (
    <Container>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Welcome to Z Investment
        </Typography>
        <Typography variant="h6" sx={{ margin: '1rem 0' }}>
          Your ultimate platform for tracking portfolios, sectors, and stocks.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ marginTop: '1rem' }}
          onClick={() => window.location.href = '/dashboard'}
        >
          Get Started
        </Button>
      </Box>

      {/* Portfolios Preview */}
      <Typography variant="h4" sx={{ margin: '2rem 0 1rem', fontWeight: 700 }}>
        Featured Portfolios
      </Typography>
      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
            <PortfolioCard portfolio={portfolio} />
          </Grid>
        ))}
      </Grid>

      {/* Sectors Overview */}
      <Typography variant="h4" sx={{ margin: '2rem 0 1rem', fontWeight: 700 }}>
        Explore Sectors
      </Typography>
      <Grid container spacing={3}>
        {sectors.map((sector) => (
          <Grid item xs={12} sm={6} md={4} key={sector.sector_id}>
            <SectorCard sector={sector} />
          </Grid>
        ))}
      </Grid>

      {/* News Section */}
      <Typography variant="h4" sx={{ margin: '2rem 0 1rem', fontWeight: 700 }}>
        Latest Stock News
      </Typography>
      <Grid container spacing={3}>
        {news.map((article, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" sx={{ margin: '1rem 0' }}>
                  {article.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Homepage;
