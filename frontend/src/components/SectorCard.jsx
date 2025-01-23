import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
    CardActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import stockService from '../services/stockService';
import { useNavigate } from 'react-router-dom';

const SectorCard = ({ sectorId }) => {
  const [sectorInfo, setSectorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate(); // for navigation to sector pages

  useEffect(() => {
    const fetchSectorInfo = async () => {
      try {
        const data = await stockService.getSectorInfo(sectorId);
        setSectorInfo(data);
      } catch (err) {
        setError('Failed to fetch sector information.');
        console.error('Error fetching sector info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectorInfo();
  }, [sectorId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'red' }}>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  const { sector, number_of_companies, total_market_cap, top_3_companies } = sectorInfo;

  return (
    <Card
    onClick={() => navigate(`/sectors/${sectorId}`)} // Navigate to sector detail page
      sx={{
        borderRadius: 6,
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        height: 500,
        maxWidth: 600,
        width: '100%',
        margin: '2rem auto',
        padding: 3,
        cursor: 'pointer', // Add cursor style to indicate it's clickable
        transition: 'transform 0.2s', // Optional: add hover effect
        '&:hover': {
          transform: 'scale(1.02)' // Optional: slight scale on hover
        }
      }}
    >
      <CardContent>
        {/* Sector Name */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mb: 2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          {sector?.name || 'Unknown Sector'}
        </Typography>

        {/* General Sector Info */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Number of Companies:</strong> {number_of_companies ?? 'N/A'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Total Market Cap:</strong>{' '}
          {total_market_cap ? `${total_market_cap.toLocaleString()} TL` : 'N/A'}
        </Typography>

        {/* Top Companies */}
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
          Top Companies:
        </Typography>
        <List dense>
          {top_3_companies?.length > 0 ? (
            top_3_companies.map((company) => (
              <ListItem
                key={company.stock_symbol}
                sx={{
                  padding: '0.3rem 0',
                }}
              >
                <ListItemText
                  primary={`${company.name || 'Unknown'} (${
                    company.stock_symbol || 'N/A'
                  })`}
                  secondary={`Market Cap: ${
                    company.market_cap
                      ? `${company.market_cap.toLocaleString()} TL`
                      : 'N/A'
                  }`}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.8rem', color: 'text.secondary' }}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No companies to display.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default SectorCard;
