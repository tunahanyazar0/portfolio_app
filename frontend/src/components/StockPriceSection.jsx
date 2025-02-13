// src/components/StockPriceSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  Schedule,
  Timeline
} from '@mui/icons-material';
import TechnicalAnalysisChart from './TechnicalAnalysisChart';
import stockService from '../services/stockService';

/*
symbol is the stock symbol like 'AAPL'
stockInfo is the stock information object : yahoo finance in döndüğü
stock : stock_symbol, name, sector_id, market_cap : db den dönülen
price: price data found in stock page.
*/
const StockPriceSection = ({
  symbol,
  stockInfo,
  stock,
  price,
  loading
}) => {
    const theme = useTheme();
    const [priceChanges, setPriceChanges] = useState({});

    useEffect(() => {
        const UpdatePriceChanges = async () => {
            // await kullanma sebebimiz: promise dönüyor, await ile promise resolve edilir. Ve dict olarak kullanılabilir.
            const stockPricesInPredefinedDates = await stockService.getStockPriceInPredefinedDateRange(symbol);
            const currentPrice = stockInfo?.currentPrice;

            /*
                stockPricesInPredefinedDates

                {stock_symbol: 'THYAO', date: '2025-02-13', close_price: '319.5'},
                ...
            */
            
            // Safely extract close prices, defaulting to null if not available
            const getPriceAtIndex = (index) => 
                stockPricesInPredefinedDates[index] 
                    ? parseFloat(stockPricesInPredefinedDates[index].close_price) 
                    : null;
            
            // Use let to create a mutable variable
            const priceChangesData = {
                '1_week': currentPrice && getPriceAtIndex(1)
                    ? ((currentPrice - getPriceAtIndex(1)) / getPriceAtIndex(1)) * 100
                    : null,
                '1_month': currentPrice && getPriceAtIndex(2)
                    ? ((currentPrice - getPriceAtIndex(2)) / getPriceAtIndex(2)) * 100
                    : null,
                '3_month': currentPrice && getPriceAtIndex(3)
                    ? ((currentPrice - getPriceAtIndex(3)) / getPriceAtIndex(3)) * 100
                    : null,
                '1_year': currentPrice && getPriceAtIndex(5)
                    ? ((currentPrice - getPriceAtIndex(5)) / getPriceAtIndex(5)) * 100
                    : null,
                '5_year': currentPrice && getPriceAtIndex(6)
                    ? ((currentPrice - getPriceAtIndex(6)) / getPriceAtIndex(6)) * 100
                    : null
            };
            
            console.log("Price Changes Data:", priceChangesData);
            setPriceChanges(priceChangesData);
        };
    
        // Only run if we have the necessary data
        if (symbol && stockInfo?.currentPrice) {
            UpdatePriceChanges();
        }
    }, [symbol, stockInfo, price]);

    const formatCurrency = (value) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
        }).format(value);
    };

    const formatPercentage = (value) => {
        if (!value) return 'N/A';
        return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    };

    const formatVolume = (value) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('tr-TR', {
        notation: 'compact',
        maximumFractionDigits: 1
        }).format(value);
    };

    // Calculate price changes
    // stockInfo.currentPrice is the current price of the stock
    // stockInfo.regularMarketPreviousClose is the previous close price of the stock
    const previousClose = stockInfo?.regularMarketPreviousClose;
    const dailyPriceChange = price - previousClose;
    const dailyChange = (dailyPriceChange / previousClose) * 100;

    const ReturnIndicator = ({ label, value }) => {
        const isPositive = value > 0;
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="center" 
              spacing={0.5}
            >
              {isPositive ? <ArrowUpward color="success" fontSize="small" /> : <ArrowDownward color="error" fontSize="small" />}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: isPositive ? 'success.main' : 'error.main'
                }}
              >
                {value ? `${isPositive ? '+' : ''}${value.toFixed(2)}%` : 'N/A'}
              </Typography>
            </Stack>
          </Box>
        );
      };
  
    return (
        <Paper 
        elevation={4} 
        sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)',
            borderRadius: 2
        }}
        >
        {/* Price Header */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Left side - Main price info */}
            <Grid item xs={12} md={6}>

                {/* First Row Box: Stock symbol, daily perc change */}
                <Box>
                    {/* Stock name and symbol in the row based stack */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {stock?.name}
                        </Typography>
                        {/* Stock symbol in chip */}
                        <Chip 
                            label={stock?.stock_symbol}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                    
                    {/* Price and daily change in the row based second stack */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h3" sx={{ fontWeight: 600 }}>
                            {formatCurrency(price)}
                        </Typography>
                    
                        <Box>
                            <Chip
                            icon={dailyChange >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                            label={`${formatCurrency(dailyPriceChange)} (${formatPercentage(dailyChange)})`}
                            color={dailyChange >= 0 ? 'success' : 'error'}
                            variant="filled"
                            sx={{ 
                                fontWeight: 600,
                                '& .MuiChip-icon': { fontSize: '20px' }
                            }}
                            />
                        </Box>
                    </Stack>
                </Box>

                {/* divider */}
                <Divider sx={{ my: 2 }} />
                    
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                    <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.8)' }}>
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                Volume
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatVolume(stockInfo?.volume)}
                                </Typography>
                                <Timeline color="action" fontSize="small" />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6}>
                <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.8)' }}>
                    <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                        Market Time
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date().toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                            })}
                        </Typography>
                        <Schedule color="action" fontSize="small" />
                        </Stack>
                    </Stack>
                    </CardContent>
                </Card>
                </Grid>
                </Stack>
                </Box>                
            </Grid>

            {/* Right side - Additional info cards */}
            <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.8)' }}>
                            <CardContent>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                Today's Range
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatCurrency(stockInfo?.dayLow)}
                                </Typography>
                                <Box
                                    sx={{
                                    flex: 1,
                                    height: 4,
                                    background: `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.success.light})`,
                                    borderRadius: 2
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatCurrency(stockInfo?.dayHigh)}
                                </Typography>
                                </Box>
                            </Stack>
                            </CardContent>
                    </Card>
                </Grid>
                
                {/* Card showing the daily perc change */}
                <Grid item xs={6}>
                    <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.8)' }}>
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Previous Close
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatCurrency(previousClose)}
                                </Typography>
                                <ShowChart color="action" fontSize="small" />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Card showing the perc changes */}
                <Grid item xs={12}>
                    <Card sx={{ mt: 2, background: 'rgba(255,255,255,0.8)' }}>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Performance
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                label="Today" 
                                value={dailyChange} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                    label="1 Week"
                                    value={priceChanges?.['1_week']} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                        label="1 Month"
                                        value={priceChanges?.['1_month']}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                    label="3 Month"
                                    value={priceChanges?.['3_month']}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                    label="1 Year"
                                    value={priceChanges?.['1_year']}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <ReturnIndicator 
                                    label="5 Year"
                                    value={priceChanges?.['5_year']}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
            </Grid>
        </Grid>

        {/* Technical Analysis Chart */}
        <TechnicalAnalysisChart symbol={symbol} />
        </Paper>
    );
};

export default StockPriceSection;