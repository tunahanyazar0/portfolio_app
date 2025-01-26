import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import stockService from '../services/stockService';

const StockMetricsTable_2 = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('currentPrice');
  const [order, setOrder] = useState('desc');
  const navigate = useNavigate();
  const theme = useTheme();

  const metrics = [
    { key: 'stock_symbol', label: 'Symbol', sortable: true },
    { key: 'currentPrice', label: 'Price', sortable: true },
    { key: 'marketCap', label: 'Market Cap', sortable: true },
    { key: 'trailingPE', label: 'P/E', sortable: true },
    { key: 'forwardEps', label: 'EPS', sortable: true },
    { key: 'earningsGrowth', label: 'Earnings Growth', sortable: true },
    { key: 'returnOnEquity', label: 'ROE', sortable: true }
  ];

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';

    if (key === 'marketCap') {
      return (value / 1e9).toFixed(1) + 'B';
    }
    if (key === 'stock_symbol') {
      return value;
    }
    if (['currentPrice', 'trailingEps', 'forwardEps', 'trailingPE'].includes(key)) {
      return value.toFixed(2);
    }
    if (key.includes('Growth') || key.includes('Margins') || key.includes('return')) {
      return (value * 100).toFixed(1) + '%';
    }
    return value.toFixed(2);
  };

  const getColorForValue = (value, key) => {
    if (key === 'earningsGrowth' || key === 'returnOnEquity') {
      return value > 0 ? theme.palette.success.main : theme.palette.error.main;
    }
    return 'inherit';
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      if (valueA === null || valueA === undefined) valueA = -Infinity;
      if (valueB === null || valueB === undefined) valueB = -Infinity;

      return order === 'desc' 
        ? (valueB || 0) - (valueA || 0) 
        : (valueA || 0) - (valueB || 0);
    });
  };

  const handleRowClick = (stockSymbol) => {
    navigate(`/stocks/${stockSymbol}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await stockService.getAllStocksDetailed();
        setStocks(data);
      } catch (err) {
        setError('Failed to fetch stock data. Please try again later.');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="60vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      overflowX: 'auto',
      boxShadow: 3,
      borderRadius: 2
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          p: 3, 
          pb: 0, 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
          backgroundClip: 'text',
          color: 'transparent'
        }}
      >
        Stocks
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {metrics.map(({ key, label, sortable }) => (
                <TableCell
                  key={key}
                  align={key === 'stock_symbol' ? 'left' : 'right'}
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'background.paper',
                    color: 'text.secondary'
                  }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : 'asc'}
                      onClick={() => handleSort(key)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData([...stocks]).map((stock) => (
              <TableRow
                key={stock.stock_symbol}
                hover
                onClick={() => handleRowClick(stock.stock_symbol)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.005)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                {metrics.map(({ key }) => (
                  <TableCell
                    key={key}
                    align={key === 'stock_symbol' ? 'left' : 'right'}
                    sx={{ 
                      fontWeight: key === 'stock_symbol' ? 'bold' : 'normal',
                      color: getColorForValue(stock[key], key)
                    }}
                  >
                    {formatValue(stock[key], key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockMetricsTable_2;