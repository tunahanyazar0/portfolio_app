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
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import stockService from '../services/stockService';

const StockMetricsTable = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('stock_symbol');
  const [order, setOrder] = useState('asc');
  const navigate = useNavigate();

  const metrics = [
    { key: 'stock_symbol', label: 'Symbol', sortable: true },
    { key: 'currentPrice', label: 'Current Price', sortable: true },
    { key: 'marketCap', label: 'Market Cap (B)', sortable: true },
    { key: 'trailingPE', label: 'Trailing P/E', sortable: true },
    { key: 'forwardPE', label: 'Forward P/E', sortable: true },
    { key: 'trailingEps', label: 'Trailing EPS', sortable: true },
    { key: 'forwardEps', label: 'Forward EPS', sortable: true },
    { key: 'priceToBook', label: 'Price to Book', sortable: true },
    { key: 'earningsGrowth', label: 'Earnings Growth', sortable: true },
    { key: 'revenueGrowth', label: 'Revenue Growth', sortable: true },
    { key: 'grossMargins', label: 'Gross Margins', sortable: true },
    { key: 'ebitdaMargins', label: 'EBITDA Margins', sortable: true },
    { key: 'operatingMargins', label: 'Operating Margins', sortable: true },
    { key: 'returnOnAssets', label: 'ROA', sortable: true },
    { key: 'returnOnEquity', label: 'ROE', sortable: true },
    { key: 'quickRatio', label: 'Quick Ratio', sortable: true },
    { key: 'currentRatio', label: 'Current Ratio', sortable: true },
    { key: 'debtToEquity', label: 'Debt/Equity', sortable: true }
  ];

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';

    if (key === 'marketCap') {
      return (value / 1e9).toFixed(2) + 'B';
    }
    if (key === 'stock_symbol') {
      return value;
    }
    if (['currentPrice', 'trailingEps', 'forwardEps'].includes(key)) {
      return value.toFixed(2);
    }
    if (key.includes('Growth') || key.includes('Margins') || key.includes('return')) {
      return (value * 100).toFixed(2) + '%';
    }
    return value.toFixed(2);
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

      if (typeof valueA === 'string' && !isNaN(valueA)) valueA = Number(valueA);
      if (typeof valueB === 'string' && !isNaN(valueB)) valueB = Number(valueB);

      if (order === 'desc') {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
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
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {error}
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper} className="w-full">
      <Table stickyHeader aria-label="stock metrics table">
        <TableHead>
          <TableRow>
            {metrics.map(({ key, label, sortable }) => (
              <TableCell
                key={key}
                align={key === 'stock_symbol' ? 'left' : 'right'}
                className="font-bold bg-gray-100"
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
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(stock.stock_symbol)}
            >
              {metrics.map(({ key }) => (
                <TableCell
                  key={key}
                  align={key === 'stock_symbol' ? 'left' : 'right'}
                  className={key === 'stock_symbol' ? 'font-medium' : ''}
                >
                  {formatValue(stock[key], key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockMetricsTable;
