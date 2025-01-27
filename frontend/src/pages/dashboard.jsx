import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';
import SectorCard from '../components/SectorCard'; // Import sector card component
import stockService from '../services/stockService'; // Import stock services
import NewsSection from '../components/NewsSection'; // Import NewsSection
import authService from '../services/authService';
import PortfolioCard from '../components/PortfolioCard';
import portfolioService from '../services/portfolioService';
import newsService from '../services/newsService';

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [sectors, setSectors] = useState([]);
  // news
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  user is sth like:
    {
      "user_id": 1,
      "username": "johndoe",
      "role": "user",
      "email": "..",
      "first_name": "..",
      "last_name": "..",
      "created_at": "2021-12-12T12:12:12.000000Z"
    }
  */

  useEffect(() => {
    // fetch data
    const fetchData = async () => {
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

        // Fetch data for portfolios, sectors, and news
        const sectorsData = await stockService.getAllSectors();
        // fetch portfolios of the user by passing the user id 
        const portfoliosData = await portfolioService.getUserPortfolios(userId);
        console.log(portfoliosData);

        // Get top 3 portfolios and sectors
        setPortfolios(portfoliosData.slice(0, 3)); // Limit to top 3 portfolios
        setSectors(sectorsData.slice(0, 3)); // Limit to top 3 sectors
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    const FetchNews = async () => {
      // Fetch news about turkish economy / stock market
      const newsData = await newsService.getNews();
      setNews(newsData);
    }


    // fetch portfolio and sector datas
    fetchData();
    // fetch news
    FetchNews();
  }, []); // these 2 function will be called when the component is mounted

  return (
    <Container>
      {/* Portfolios Preview */}
      <Typography
        variant="h4" 
        sx={{ 
            mb: 4,
            margin: '2rem 0 1rem',
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            backgroundClip: 'text',
            color: 'transparent'
        }}
      >
        Featured Portfolios
      </Typography>
      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.porfolio_id}>
            <PortfolioCard portfolio={portfolio} />
          </Grid>
        ))}
      </Grid>

      {/* Sectors Overview */}
      <Typography 
        variant="h4" 
        sx={{ 
            mb: 4,
            margin: '2rem 0 1rem',
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            backgroundClip: 'text',
            color: 'transparent'
        }}
      
      >
        Explore Sectors
      </Typography>
      <Grid container spacing={3}>
        {sectors.map((sector) => (
          <Grid item xs={12} sm={6} md={4} key={sector.sector_id}>
            <SectorCard sectorId={sector.sector_id} />
          </Grid>
        ))}
      </Grid>

      {/* News Section */}
      <NewsSection news = {news} />
    </Container>
  );
};

export default Dashboard;
