import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider,
  Box
} from '@mui/material';
import { 
  Business as BusinessIcon,
  People as PeopleIcon,
  LocationCity as LocationCityIcon
} from '@mui/icons-material';

const StockOverviewCard = ({ stockInfo }) => {
  return (
    <Card elevation={4} sx={{ 
      background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)',
      height: '100%'
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center',
            mb: 2 
          }}
        >
          <BusinessIcon sx={{ mr: 2 }} color="primary" />
          Company Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationCityIcon color="secondary" sx={{ mr: 2 }} />
              <Typography variant="body1">
                <strong>Industry:</strong> {stockInfo.industry ? stockInfo.industry : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon color="info" sx={{ mr: 2 }} />
              <Typography variant="body1">
                <strong>Employees:</strong> {stockInfo.fullTimeEmployees ? stockInfo.fullTimeEmployees.toLocaleString() : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {stockInfo.longBusinessSummary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StockOverviewCard;