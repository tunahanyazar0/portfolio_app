import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Paper,
    Divider
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import BarChart from '../components/BarChart';

// one for each chart
const ChartCard = ({ title, chart, icon, unit }) => (
  <Card 
    elevation={4} 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)'
    }}
  >
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2 
      }}>
        {icon}
        <Typography 
          variant="h6" 
          sx={{ 
            ml: 2, 
            fontWeight: 'bold' 
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {chart}
      </Box>
    </CardContent>
  </Card>
);

const FinancialChartsSection = ({ 
  revenueChartData,
  operatingIncomeChartData,
  operatingMarginChartData,
  grossProfitChartData,
  netProfitChartData,
  totalAssetsChartData,
  totalLiabilitiesChartData,
  totalEquityChartData,
  currentAssetsChartData,
  currentLiabilitiesChartData,
  freeCashFlowChartData
}) => {
  const chartConfigurations = [
    {
      title: 'Revenue per Quarter',
      data: revenueChartData,
      icon: <BarChartIcon color="primary" />,
      unit: 'TL'
    },
    {
      title: 'Operating Income per Quarter',
      data: operatingIncomeChartData,
      icon: <LineChartIcon color="secondary" />,
      unit: 'TL'
    },
    {
      title: 'Operating Margin per Quarter',
      data: operatingMarginChartData,
      icon: <TimelineIcon color="info" />,
      unit: '%'
    },
    {
      title: 'Gross Profit per Quarter',
      data: grossProfitChartData,
      icon: <BarChartIcon color="success" />,
      unit: 'TL'
    },
    {
      title: 'Net Profit per Quarter',
      data: netProfitChartData,
      icon: <LineChartIcon color="error" />,
      unit: 'TL'
    },
    {
      title: 'Total Assets per Quarter',
      data: totalAssetsChartData,
      icon: <BarChartIcon color="warning" />,
      unit: 'TL'
    },
    {
      title: 'Total Liabilities per Quarter',
      data: totalLiabilitiesChartData,
      icon: <LineChartIcon color="primary" />,
      unit: 'TL'
    },
    {
      title: 'Total Equity per Quarter',
      data: totalEquityChartData,
      icon: <TimelineIcon color="secondary" />,
      unit: 'TL'
    },
    {
      title: 'Free Cash Flow per Quarter',
      data: freeCashFlowChartData,
      icon: <BarChartIcon color="info" />,
      unit: 'TL'
    }
  ];

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={4}>
        {chartConfigurations.map((chart, index) => (
          chart.data && (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <ChartCard 
                title={chart.title}
                chart={<BarChart data={chart.data} unit={chart.unit} />}
                icon={chart.icon}
                unit={chart.unit}
              />
            </Grid>
          )
        ))}
      </Grid>
    </Box>
  );
};

export default FinancialChartsSection;