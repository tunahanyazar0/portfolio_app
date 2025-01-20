import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import portfolioService from '../services/portfolioService';
import stockService from '../services/stockService';
import { useParams } from 'react-router-dom';

const PortfolioPage = ({ match }) => {
    const { id: portfolioId } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [sectorMap, setSectorMap] = useState({});
    const [totalValue, setTotalValue] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [loading, setLoading] = useState(true);

    const COLORS = [
      '#2563eb', '#059669', '#d97706', '#dc2626', 
      '#7c3aed', '#db2777', '#2dd4bf', '#84cc16',
      '#6366f1', '#ec4899', '#14b8a6', '#f59e0b'
    ];

    const formatNumber = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        return value.toFixed(2);
    };

    const formatCurrency = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        return new Intl.NumberFormat('tr-TR', { 
            style: 'currency', 
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        }).format(value);
    };

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const portfolioData = await portfolioService.getPortfolio(portfolioId);
                setPortfolio(portfolioData);

                const allSectors = await stockService.getAllSectors();
                const sectorMapping = {};
                allSectors.forEach((sector) => {
                    sectorMapping[sector.sector_id] = sector.name;
                });
                setSectorMap(sectorMapping);

                const holdingsData = await portfolioService.getPortfolioHoldings(portfolioId);

                const enhancedHoldings = await Promise.all(
                    holdingsData.map(async (holding) => {
                        const stockPriceInfo = await stockService.getStockPrice(holding.stock_symbol);
                        const SectorData = await stockService.getSectorOfStock(holding.stock_symbol);

                        const currentMarketPrice = Number(stockPriceInfo.close_price);
                        const marketValue = currentMarketPrice * holding.quantity;
                        const profitLoss = (currentMarketPrice - holding.average_price) * holding.quantity;
                        const profitLossPercentage = ((currentMarketPrice - holding.average_price) / holding.average_price) * 100;

                        return {
                            ...holding,
                            currentMarketPrice,
                            marketValue,
                            profitLoss,
                            profitLossPercentage,
                            sector: sectorMapping[SectorData.sector_id]
                        };
                    })
                );

                const totalPortfolioValue = enhancedHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
                const totalPortfolioProfit = enhancedHoldings.reduce((sum, holding) => sum + holding.profitLoss, 0);
                
                setTotalValue(totalPortfolioValue);
                setTotalProfit(totalPortfolioProfit);
                setHoldings(enhancedHoldings);

                const uniqueSectors = [...new Set(enhancedHoldings.map((holding) => holding.sector))];
                setSectors(uniqueSectors);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [portfolioId]);

    const getSectorHoldings = (sectorName) => {
        return holdings.filter(holding => holding.sector === sectorName);
    };

    const getSectorValue = (sectorName) => {
        return holdings
            .filter(holding => holding.sector === sectorName)
            .reduce((sum, holding) => sum + holding.marketValue, 0);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    backgroundClip: 'text',
                    color: 'transparent'
                }}>
                    {portfolio?.name || 'Portfolio Details'}
                </Typography>
                
                <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                            borderRadius: 2
                        }}>
                            <Typography variant="h6" color="text.secondary">Total Value</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                                {formatCurrency(totalValue)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                            borderRadius: 2
                        }}>
                            <Typography variant="h6" color="text.secondary">Total P/L</Typography>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 'bold', 
                                color: totalProfit >= 0 ? '#059669' : '#dc2626'
                            }}>
                                {formatCurrency(totalProfit)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ 
                        p: 3, 
                        height: '100%',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
                            Market Value Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={sectors.map(sector => ({
                                        name: sector,
                                        value: getSectorValue(sector)
                                    }))}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    innerRadius={80}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                >
                                    {sectors.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {sectors.map((sector) => (
                            <Paper key={sector} elevation={3} sx={{ 
                                borderRadius: 2,
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)'
                            }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<Typography variant="h6">↓</Typography>}
                                        sx={{ 
                                            '& .MuiAccordionSummary-content': { 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 2
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ flex: 1 }}>{sector}</Typography>
                                        <Chip 
                                            label={formatCurrency(getSectorValue(sector))}
                                            sx={{ 
                                                backgroundColor: COLORS[sectors.indexOf(sector) % COLORS.length],
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0 }}>
                                        {getSectorHoldings(sector).map((holding) => (
                                            <Box
                                                key={holding.holding_id}
                                                sx={{
                                                    p: 2,
                                                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                                                }}
                                            >
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item xs={12} sm={3}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {holding.stock_symbol}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Quantity: {holding.quantity}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <Typography variant="body2">
                                                            Avg: {formatCurrency(holding.average_price)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={2}>
                                                        <Typography variant="body2">
                                                            Current: {formatCurrency(holding.currentMarketPrice)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: holding.profitLoss >= 0 ? '#059669' : '#dc2626',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {formatCurrency(holding.profitLoss)} ({formatNumber(holding.profitLossPercentage)}%)
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PortfolioPage;