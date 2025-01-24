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
  TrendingUp as ProfitabilityIcon,
  AccountBalance as LiquidityIcon,
  AccountBalanceWallet as DebtIcon
} from '@mui/icons-material';

// one for each type of ratio
const RatioSection = ({ title, ratios, icon }) => (
  <Box sx={{ mb: 3 }}>
    <Typography 
      variant="subtitle1" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        fontWeight: 'bold',
        mb: 2 
      }}
    >
      {icon}
      <Box sx={{ ml: 2 }}>{title}</Box>
    </Typography>
    <Grid container spacing={2}>
      {ratios.map((ratio, index) => (
        ratio.value !== null && ratio.value !== undefined ? (
          <Grid item xs={6} md={4} key={index}>
            <Typography variant="body2" color="text.secondary">
              {ratio.label}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {ratio.value}
            </Typography>
          </Grid>
        ) : null
      ))}
    </Grid>
  </Box>
);

const FinancialRatiosCard = ({ stockInfo }) => {
  const basicRatios = [
    { label: 'Market Cap', value: stockInfo.marketCap },
    { label: 'Price to Book', value: stockInfo.priceToBook },
    { label: 'Beta', value: stockInfo.beta },
    { label: 'Trailing EPS', value: stockInfo.trailingEps },
    { label: 'Forward EPS', value: stockInfo.forwardEps }
  ];

  const profitabilityRatios = [
    { label: 'Operating Margin', value: stockInfo.operatingMargins ? `${(stockInfo.operatingMargins * 100).toFixed(2)}%` : null },
    { label: 'Gross Margin', value: stockInfo.grossMargins ? `${(stockInfo.grossMargins * 100).toFixed(2)}%` : null },
    { label: 'EBITDA Margin', value: stockInfo.ebitdaMargins ? `${(stockInfo.ebitdaMargins * 100).toFixed(2)}%` : null },
    { label: 'Profit Margin', value: stockInfo.profitMargins ? `${(stockInfo.profitMargins * 100).toFixed(2)}%` : null },
    { label: 'Return on Equity', value: stockInfo.returnOnEquity ? `${(stockInfo.returnOnEquity * 100).toFixed(2)}%` : null },
    { label: 'Return on Assets', value: stockInfo.returnOnAssets ? `${(stockInfo.returnOnAssets * 100).toFixed(2)}%` : null },
    { label: 'Trailing PE', value: stockInfo.trailingPE },
    { label: 'Forward PE', value: stockInfo.forwardPE },
    { label: 'Price to Sales', value: stockInfo.priceToSalesTrailing12Months }
  ];

  const liquidityRatios = [
    { label: 'Current Ratio', value: stockInfo.currentRatio },
    { label: 'Quick Ratio', value: stockInfo.quickRatio },
    { label: 'Cash Ratio', value: stockInfo.cashRatio },
    { label: 'Cash Per Share', value: stockInfo.cashPerShare },
    { label: 'Operating Cash Flow', value: stockInfo.operatingCashFlow },
    { label: 'Free Cash Flow', value: stockInfo.freeCashFlow },
  ];

  const debtRatios = [
    { label: 'Debt to Equity', value: stockInfo.debtToEquity },
    { label: 'Total Debt', value: stockInfo.totalDebt },
    { label: 'Long Term Debt', value: stockInfo.longTermDebt },
    { label: 'Total Debt to Total Assets', value: stockInfo.totalDebtToTotalAssets },
    { label: 'Interest Coverage', value: stockInfo.interestCoverage },
    { label: 'Debt to Capital', value: stockInfo.debtToCapital }
  ];

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
          Financial Ratios
        </Typography>
        <Divider sx={{ mb: 2 }} />

        
        {/* Basic Ratios */}
        <RatioSection 
          title="Basic Ratios" 
          ratios={basicRatios} 
          icon={<ProfitabilityIcon color="primary" />}
        />

        <Divider sx={{ my: 2 }} />

        {/* Profitability Ratios */}
        <RatioSection 
          title="Profitability Ratios" 
          ratios={profitabilityRatios} 
          icon={<ProfitabilityIcon color="primary" />} 
        />
        
        <Divider sx={{ my: 2 }} />
        
        {/* Liquidity Ratios */}
        <RatioSection 
          title="Liquidity Ratios" 
          ratios={liquidityRatios} 
          icon={<LiquidityIcon color="secondary" />} 
        />
        
        <Divider sx={{ my: 2 }} />
        
        {/* Debt Ratios */}
        <RatioSection 
          title="Debt Ratios" 
          ratios={debtRatios} 
          icon={<DebtIcon color="error" />} 
        />
      </CardContent>
    </Card>
  );
};

export default FinancialRatiosCard;