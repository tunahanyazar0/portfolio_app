import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import stockService from '../services/stockService';
import SectorCard from '../components/SectorCard';

const AllSectorsPage = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await stockService.getAllSectors();
        /*
          data is sth like: we just use sector_id
          [
            {
              "sector_id": 2,
              "name": "Airlines"
            },
            {
              "sector_id": 7,
              "name": "Banks - Regional"
            },
            {
              "sector_id": 3,
              "name": "Asset Management"
            },
          ]

        */
        setSectors(data);
      } catch (err) {
        console.error('Error fetching sectors:', err);
        setError('Failed to load sectors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
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
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        {sectors.map((sector) => (
          <Grid item xs={12} sm={6} md={4} key={sector.sector_id}>
            <SectorCard
              sectorId={sector.sector_id}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllSectorsPage;
