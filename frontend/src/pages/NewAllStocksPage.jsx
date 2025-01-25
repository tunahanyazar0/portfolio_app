import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import stockService from '../services/stockService';

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    padding: '12px 16px'
  },
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.grey[100]
  }
}));

const NewStocksPage = () => {
    // all stocks are fetched from the backend and stored in the state 
    const [stocks, setStocks] = useState([]);
    // filteredStocks state is used to store the stocks that meet the filter criteria
    const [filteredStocks, setFilteredStocks] = useState([]);
    
    // loading state is used to show a loading spinner while fetching data
    const [loading, setLoading] = useState(true);
    // searchQuery state is used to store the search query entered by the user
    const [searchQuery, setSearchQuery] = useState('');
    // openFiltersDialog state is used to control the visibility of the filters dialog
    const [openFiltersDialog, setOpenFiltersDialog] = useState(false);
    // sortColumn state is used to store the column that the stocks are sorted by
    const [sortColumn, setSortColumn] = useState(null);
    // sortDirection state is used to store the direction of the sort
    const [sortDirection, setSortDirection] = useState(null);
    
    // filters state is used to store the filter criteria entered by the user
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: Infinity,
        minMarketCap: 0,
        maxMarketCap: Infinity,
        minDayChange: -Infinity,
        maxDayChange: Infinity,
        minVolume: 0,
        maxVolume: Infinity,
        minPriceToEarnings: 0,
        maxPriceToEarnings: Infinity,
        minPriceToSales: -Infinity,
        maxPriceToSales: Infinity,
        minPriceToBook: -Infinity,
        maxPriceToBook: Infinity,
        minPriceToEbitda: -Infinity,
        maxPriceToEbitda: Infinity,
        minNetProfitMargin: -Infinity,
        maxNetProfitMargin: Infinity,
        minOperatingMargin: -Infinity,
        maxOperatingMargin: Infinity,
        minGrossProfitMargin: -Infinity,
        maxGrossProfitMargin: Infinity,
        minReturnOnAssets: -Infinity,
        maxReturnOnAssets: Infinity,
        minReturnOnEquity: -Infinity,
        maxReturnOnEquity: Infinity,
        minDebtToEquity: -Infinity,
        maxDebtToEquity: Infinity,
        minCurrentRatio: -Infinity,
        maxCurrentRatio: Infinity,
        minQuickRatio: -Infinity,
        maxQuickRatio: Infinity,
        minInterestCoverage: -Infinity,
        maxInterestCoverage: Infinity
    });

    useEffect(() => {
        const fetchStocksData = async () => {
        try {
            // set loading to true to show the loading spinner
            setLoading(true);
            // fetch all stocks with detailed information
            const allStocks = await stockService.getAllStocksDetailed();


            // to all stocks, add the price information for the last 5 years
            // and also, calculate the market cap and the percentage change for the last 5 years add these as keywords to the stock object
            const stocksWithDetails = await Promise.all(
                allStocks.map(async (stock) => {
                    const stockPrices = await stockService.getStockPriceInPredefinedDateRange(stock.stock_symbol);
                    return {
                    ...stock,
                    market_cap: stock.sharesOutstanding * stock.currentPrice,
                    regularMarketChangePercent: ( (stock.currentPrice / stock.previousClose)  - 1 ) * 100,
                    prices: stockPrices
                    };
                })
            );

            // stocksWithDetails = stock detailed info + price info on the predefined date range

            setStocks(stocksWithDetails);
            setFilteredStocks(stocksWithDetails);
            // set loading to false to hide the loading spinner
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            setLoading(false);
        }
        };

        fetchStocksData();
    }, []); // run whenever the component mounts


    // days input unu alıcak ve prices alıcak = ve percentage change hesaplayacak
    const calculatePercentageChange = (prices, days) => {
        if (!prices || prices.length < 2) return 0;

        /*
            example prices in the stocksWithDetails array:
            prices[0] = today stock price response
            prices[1] = one week before stock price response
            ...
                [
            {
                "stock_symbol": "aghol",
                "date": "2025-01-24",
                "close_price": "315.0"
            },
            {
                "stock_symbol": "aghol",
                "date": "2025-01-17",
                "close_price": "309.0"
            },
            {
                "stock_symbol": "aghol",
                "date": "2024-12-26",
                "close_price": "363.0"
            },
            {
                "stock_symbol": "aghol",
                "date": "2024-10-28",
                "close_price": "287.5"
            },
            {
                "stock_symbol": "aghol",
                "date": "2024-07-29",
                "close_price": "427.25"
            },
            {
                "stock_symbol": "aghol",
                "date": "2024-01-26",
                "close_price": "227.0554656982422"
            },
            {
                "stock_symbol": "aghol",
                "date": "2022-01-26",
                "close_price": "33.286109924316406"
            },
            {
                "stock_symbol": "aghol",
                "date": "2020-01-27",
                "close_price": "19.25945472717285"
            }
            ]
            */
        if (days == 7) return ((prices[0].close_price - prices[1].close_price) / prices[1].close_price) * 100;
        if (days == 30) return ((prices[0].close_price - prices[2].close_price) / prices[2].close_price) * 100;
        if (days == 90) return ((prices[0].close_price - prices[3].close_price) / prices[3].close_price) * 100;
        if (days == 365) return ((prices[0].close_price - prices[4].close_price) / prices[5].close_price) * 100;
        if (days == 3*365) return ((prices[0].close_price - prices[6].close_price) / prices[6].close_price) * 100;
        if (days == 5*365) return ((prices[0].close_price - prices[7].close_price) / prices[7].close_price) * 100;
        else return 0;
    };   


  const applyFilters = () => {
    const filtered = stocks.filter(stock => {
        // Some filters might be null, so we need to check if they are null before applying the filter
        // If the filter is null, we assume that the stock meets the filter criteria
        // If the filter is not null, we check if the stock meets the filter criteria

        const meetsBasicFilters =   
            (filters.minPrice === 0 || stock.currentPrice >= filters.minPrice) &&
            (filters.maxPrice === Infinity || stock.currentPrice <= filters.maxPrice) &&
            (filters.minMarketCap === 0 || stock.market_cap >= filters.minMarketCap) &&
            (filters.maxMarketCap === Infinity || stock.market_cap <= filters.maxMarketCap) &&
            (filters.minVolume === 0 || stock.regularMarketVolume >= filters.minVolume) &&
            (filters.maxVolume === Infinity || stock.regularMarketVolume <= filters.maxVolume);

        const meetsProfitabilityFilters =
            (filters.minPriceToEarnings === 0 || stock.trailingPE >= filters.minPriceToEarnings) &&
            (filters.maxPriceToEarnings === Infinity || stock.trailingPE <= filters.maxPriceToEarnings) &&
            (filters.minPriceToSales === -Infinity || stock.priceToSalesTrailing12Months >= filters.minPriceToSales) &&
            (filters.maxPriceToSales === Infinity || stock.priceToSalesTrailing12Months <= filters.maxPriceToSales) &&
            (filters.minPriceToBook === -Infinity || stock.priceToBook >= filters.minPriceToBook) &&
            (filters.maxPriceToBook === Infinity || stock.priceToBook <= filters.maxPriceToBook) && 
            (filters.minPriceToEbitda === -Infinity || stock.enterpriseToEbitda >= filters.minPriceToEbitda) &&
            (filters.maxPriceToEbitda === Infinity || stock.enterpriseToEbitda <= filters.maxPriceToEbitda);

        const meetsMarginsFilters =
            (filters.minNetProfitMargin === -Infinity || stock.profitMargins >= filters.minNetProfitMargin) &&
            (filters.maxNetProfitMargin === Infinity || stock.profitMargins <= filters.maxNetProfitMargin) &&
            (filters.minOperatingMargin === -Infinity || stock.operatingMargins >= filters.minOperatingMargin) &&
            (filters.maxOperatingMargin === Infinity || stock.operatingMargins <= filters.maxOperatingMargin) &&
            (filters.minGrossProfitMargin === -Infinity || stock.grossMargins >= filters.minGrossProfitMargin) &&
            (filters.maxGrossProfitMargin === Infinity || stock.grossMargins <= filters.maxGrossProfitMargin);
            
        const meetsPerformanceFilters =
            (filters.minReturnOnAssets === -Infinity || stock.returnOnAssets >= filters.minReturnOnAssets) &&
            (filters.maxReturnOnAssets === Infinity || stock.returnOnAssets <= filters.maxReturnOnAssets) &&
            (filters.minReturnOnEquity === -Infinity || stock.returnOnEquity >= filters.minReturnOnEquity) &&
            (filters.maxReturnOnEquity === Infinity || stock.returnOnEquity <= filters.maxReturnOnEquity);
            

        const meetsBalanceSheetFilters =
            (filters.minDebtToEquity === -Infinity || stock.debtToEquity >= filters.minDebtToEquity) &&
            (filters.maxDebtToEquity === Infinity || stock.debtToEquity <= filters.maxDebtToEquity) &&
            (filters.minCurrentRatio === -Infinity || stock.currentRatio >= filters.minCurrentRatio) &&
            (filters.maxCurrentRatio === Infinity || stock.currentRatio <= filters.maxCurrentRatio) &&
            (filters.minQuickRatio === -Infinity || stock.quickRatio >= filters.minQuickRatio) &&
            (filters.maxQuickRatio === Infinity || stock.quickRatio <= filters.maxQuickRatio);
   
      return (
        meetsBasicFilters &&
        meetsProfitabilityFilters &&
        meetsMarginsFilters &&
        meetsPerformanceFilters &&
        meetsBalanceSheetFilters
      );
    });

    setFilteredStocks(filtered);
    setOpenFiltersDialog(false); // close the filters dialog after applying the filters
  };

  /*
  const handleSearch = (query) => {
    const filtered = stocks.filter(stock => 
      stock.stock_symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
    setSearchQuery(query);
  };*/

  // Function to have a search bar to search for stocks
  // This will filter the filteredStocks state based on the search query
    const handleSearch = (query) => {
        if (!query) {
        setFilteredStocks(stocks);
        setSearchQuery(query);
        return;
        }
        if (filteredStocks.length === 0) return;
        const filtered = filteredStocks.filter(stock =>
        stock.stock_symbol.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredStocks(filtered);
        setSearchQuery(query);
    };

    // Function to sort the stocks based on the column
    const handleSort = (column) => {
        if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
        setSortColumn(column);
        setSortDirection('asc');
        }
    };

    // sort the stocks based on the sortColumn and sortDirection
    const sortedStocks = useMemo(() => {
        if (!sortColumn) return filteredStocks;
        return [...filteredStocks].sort((a, b) => {
          if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
          if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }, [filteredStocks, sortColumn, sortDirection]);

  // stock table ı içeren jsx i döndüren fonksiyon
  const renderStockTable = () => (
    <TableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('stock_symbol')}>Symbol</TableCell>
            <TableCell onClick={() => handleSort('currentPrice')}>Current Price</TableCell>
            <TableCell onClick={() => handleSort('regularMarketChangePercent')}>Day Change %</TableCell>
            <TableCell onClick={() => handleSort('regularMarketVolume')}>Volume</TableCell>
            <TableCell onClick={() => handleSort('market_cap')}>Market Cap</TableCell>
            <TableCell onClick={() => handleSort('prices', 7)}>1 Week %</TableCell>
            <TableCell onClick={() => handleSort('prices', 30)}>1 Month %</TableCell>
            <TableCell onClick={() => handleSort('prices', 90)}>3 Months %</TableCell>
            <TableCell onClick={() => handleSort('prices', 365)}>1 Year %</TableCell>
            <TableCell onClick={() => handleSort('prices', 3 * 365)}>3 Years %</TableCell>
            <TableCell onClick={() => handleSort('prices', 5 * 365)}>5 Years %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStocks.map(stock => (
            <TableRow key={stock.stock_symbol}>
              <TableCell>{stock.stock_symbol}</TableCell>
              <TableCell>{stock.currentPrice?.toFixed(2)}</TableCell>
              <TableCell style={{ color: stock.regularMarketChangePercent >= 0 ? 'green' : 'red' }}>
                {stock.regularMarketChangePercent?.toFixed(2)}%
              </TableCell>
              <TableCell>{stock.regularMarketVolume?.toLocaleString()}</TableCell>
              <TableCell>{stock.market_cap?.toLocaleString()}</TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 7) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 7).toFixed(2)}%
              </TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 30) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 30).toFixed(2)}%
              </TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 90) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 90).toFixed(2)}%
              </TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 365) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 365).toFixed(2)}%
              </TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 3 * 365) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 3 * 365).toFixed(2)}%
              </TableCell>
              <TableCell style={{ color: calculatePercentageChange(stock.prices, 5 * 365) >= 0 ? 'green' : 'red' }}>
                {calculatePercentageChange(stock.prices, 5 * 365).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );

    // filters dialog ı içeren jsx i döndüren fonksiyon
  const renderFiltersDialog = () => (
    <Dialog
      open={openFiltersDialog}
      onClose={() => setOpenFiltersDialog(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          background: 'linear-gradient(45deg, #2563eb, #7c3aed)'
        }
      }}
    >
      <DialogTitle style={{ color: 'white' }}>Stock Filters</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>

          {/* Basic Filters */}
          <Grid item xs={12}><Typography variant="h6">Basic Filters</Typography></Grid>
          <Grid item xs={6}>
            <TextField
              label="Min Price"
              type="number"
              fullWidth
              value={filters.minPrice === 0 ? '' : filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value) || 0})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max Price"
              type="number"
              fullWidth
              value={filters.maxPrice === Infinity ? '' : filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value) || Infinity})}
            />
          </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Market Cap"
                type="number"
                fullWidth
                value={filters.minMarketCap === 0 ? '' : filters.minMarketCap}
                onChange={(e) => setFilters({...filters, minMarketCap: Number(e.target.value) || 0})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Market Cap"
                type="number"
                fullWidth
                value={filters.maxMarketCap === Infinity ? '' : filters.maxMarketCap}
                onChange={(e) => setFilters({...filters, maxMarketCap: Number(e.target.value) || Infinity})}
            />
            </Grid>
            {/* Once a filter changes, change the filter variable's corresponding key */}
            <Grid item xs={6}>
            <TextField
                label="Min Volume"
                type="number"
                fullWidth
                value={filters.minVolume === 0 ? '' : filters.minVolume}
                onChange={(e) => setFilters({...filters, minVolume: Number(e.target.value) || 0})}
            />
            </Grid> 
            <Grid item xs={6}>
            <TextField
                label="Max Volume"
                type="number"
                fullWidth
                value={filters.maxVolume === Infinity ? '' : filters.maxVolume}
                onChange={(e) => setFilters({...filters, maxVolume: Number(e.target.value) || Infinity})}
            />
            </Grid>

            {/* Profitability Filters */}
            <Grid item xs={12}><Typography variant="h6">Profitability Filters</Typography></Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Price to Earnings"
                type="number"
                fullWidth
                value={filters.minPriceToEarnings === 0 ? '' : filters.minPriceToEarnings}
                onChange={(e) => setFilters({...filters, minPriceToEarnings: Number(e.target.value) || 0})}
            />
            </Grid> 
            <Grid item xs={6}>
            <TextField
                label="Max Price to Earnings"
                type="number"
                fullWidth
                value={filters.maxPriceToEarnings === Infinity ? '' : filters.maxPriceToEarnings}
                onChange={(e) => setFilters({...filters, maxPriceToEarnings: Number(e.target.value) || Infinity})}
            />
            </Grid> 
            <Grid item xs={6}>
            <TextField
                label="Min Price to Sales"
                type="number"
                fullWidth
                value={filters.minPriceToSales === -Infinity ? '' : filters.minPriceToSales}
                onChange={(e) => setFilters({...filters, minPriceToSales: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Price to Sales"
                type="number"
                fullWidth
                value={filters.maxPriceToSales === Infinity ? '' : filters.maxPriceToSales}
                onChange={(e) => setFilters({...filters, maxPriceToSales: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Price to Book"
                type="number"
                fullWidth
                value={filters.minPriceToBook === -Infinity ? '' : filters.minPriceToBook}
                onChange={(e) => setFilters({...filters, minPriceToBook: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Price to Book"
                type="number"
                fullWidth
                value={filters.maxPriceToBook === Infinity ? '' : filters.maxPriceToBook}
                onChange={(e) => setFilters({...filters, maxPriceToBook: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Price to EBITDA"
                type="number"
                fullWidth
                value={filters.minPriceToEbitda === -Infinity ? '' : filters.minPriceToEbitda}
                onChange={(e) => setFilters({...filters, minPriceToEbitda: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Price to EBITDA"
                type="number"
                fullWidth
                value={filters.maxPriceToEbitda === Infinity ? '' : filters.maxPriceToEbitda}
                onChange={(e) => setFilters({...filters, maxPriceToEbitda: Number(e.target.value) || Infinity})}
            />
            </Grid>

            {/* Margins Filters */}
            <Grid item xs={12}><Typography variant="h6">Margins Filters</Typography></Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Net Profit Margin"
                type="number"
                fullWidth
                value={filters.minNetProfitMargin === -Infinity ? '' : filters.minNetProfitMargin}
                onChange={(e) => setFilters({...filters, minNetProfitMargin: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Net Profit Margin"
                type="number"
                fullWidth
                value={filters.maxNetProfitMargin === Infinity ? '' : filters.maxNetProfitMargin}
                onChange={(e) => setFilters({...filters, maxNetProfitMargin: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Operating Margin"
                type="number"
                fullWidth
                value={filters.minOperatingMargin === -Infinity ? '' : filters.minOperatingMargin}
                onChange={(e) => setFilters({...filters, minOperatingMargin: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Operating Margin"
                type="number"
                fullWidth
                value={filters.maxOperatingMargin === Infinity ? '' : filters.maxOperatingMargin}
                onChange={(e) => setFilters({...filters, maxOperatingMargin: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Gross Profit Margin"
                type="number"
                fullWidth
                value={filters.minGrossProfitMargin === -Infinity ? '' : filters.minGrossProfitMargin}
                onChange={(e) => setFilters({...filters, minGrossProfitMargin: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Gross Profit Margin"
                type="number"
                fullWidth
                value={filters.maxGrossProfitMargin === Infinity ? '' : filters.maxGrossProfitMargin}
                onChange={(e) => setFilters({...filters, maxGrossProfitMargin: Number(e.target.value) || Infinity})}
            />
            </Grid>
            
            {/* Performance Filters */}
            <Grid item xs={12}><Typography variant="h6">Performance Filters</Typography></Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Return on Assets"
                type="number"
                fullWidth
                value={filters.minReturnOnAssets === -Infinity ? '' : filters.minReturnOnAssets}
                onChange={(e) => setFilters({...filters, minReturnOnAssets: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Return on Assets"
                type="number"
                fullWidth
                value={filters.maxReturnOnAssets === Infinity ? '' : filters.maxReturnOnAssets}
                onChange={(e) => setFilters({...filters, maxReturnOnAssets: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Return on Equity"
                type="number"
                fullWidth
                value={filters.minReturnOnEquity === -Infinity ? '' : filters.minReturnOnEquity}
                onChange={(e) => setFilters({...filters, minReturnOnEquity: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Return on Equity"
                type="number"
                fullWidth
                value={filters.maxReturnOnEquity === Infinity ? '' : filters.maxReturnOnEquity}
                onChange={(e) => setFilters({...filters, maxReturnOnEquity: Number(e.target.value) || Infinity})}
            />
            </Grid>

            {/* Balance Sheet Filters */}
            <Grid item xs={12}><Typography variant="h6">Balance Sheet Filters</Typography></Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Debt to Equity"
                type="number"
                fullWidth
                value={filters.minDebtToEquity === -Infinity ? '' : filters.minDebtToEquity}
                onChange={(e) => setFilters({...filters, minDebtToEquity: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Debt to Equity"
                type="number"
                fullWidth
                value={filters.maxDebtToEquity === Infinity ? '' : filters.maxDebtToEquity}
                onChange={(e) => setFilters({...filters, maxDebtToEquity: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Current Ratio"
                type="number"
                fullWidth
                value={filters.minCurrentRatio === -Infinity ? '' : filters.minCurrentRatio}
                onChange={(e) => setFilters({...filters, minCurrentRatio: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Current Ratio"
                type="number"
                fullWidth
                value={filters.maxCurrentRatio === Infinity ? '' : filters.maxCurrentRatio}
                onChange={(e) => setFilters({...filters, maxCurrentRatio: Number(e.target.value) || Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Min Quick Ratio"
                type="number"
                fullWidth
                value={filters.minQuickRatio === -Infinity ? '' : filters.minQuickRatio}
                onChange={(e) => setFilters({...filters, minQuickRatio: Number(e.target.value) || -Infinity})}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Max Quick Ratio"
                type="number"
                fullWidth
                value={filters.maxQuickRatio === Infinity ? '' : filters.maxQuickRatio}
                onChange={(e) => setFilters({...filters, maxQuickRatio: Number(e.target.value) || Infinity})}
            />
            </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setFilters({
              minPrice: 0,
              maxPrice: Infinity,
              minMarketCap: 0,
              maxMarketCap: Infinity,
              minDayChange: -Infinity,
              maxDayChange: Infinity,
              minVolume: 0,
              maxVolume: Infinity,
              minPriceToEarnings: 0,
                maxPriceToEarnings: Infinity,
                minPriceToSales: -Infinity,
                maxPriceToSales: Infinity,
                minPriceToBook: -Infinity,
                maxPriceToBook: Infinity,
                minPriceToEbitda: -Infinity,
                maxPriceToEbitda: Infinity,
                minNetProfitMargin: -Infinity,
                maxNetProfitMargin: Infinity,
                minOperatingMargin: -Infinity,
                maxOperatingMargin: Infinity,
                minGrossProfitMargin: -Infinity,
                maxGrossProfitMargin: Infinity,
                minReturnOnAssets: -Infinity,
                maxReturnOnAssets: Infinity,
                minReturnOnEquity: -Infinity,
                maxReturnOnEquity: Infinity,
                minDebtToEquity: -Infinity,
                maxDebtToEquity: Infinity,
                minCurrentRatio: -Infinity,
                maxCurrentRatio: Infinity,
                minQuickRatio: -Infinity,
                maxQuickRatio: Infinity,
                minInterestCoverage: -Infinity,
                maxInterestCoverage: Infinity
            });
            }
            }
        >
            Clear Filters
        </Button>
        <Button onClick={() => setOpenFiltersDialog(false)}>Cancel</Button>
        <Button onClick={applyFilters} color="primary">Apply Filters</Button>
        </DialogActions>
    </Dialog>
  );

  // loading state inde iken loading spinner ı göster (checked by the state variable)
  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Search Stocks"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={() => setOpenFiltersDialog(true)}
        >
          All Filters
        </Button>
      </Box>

      {renderStockTable()}
      {renderFiltersDialog()}
    </Box>
  );
};

export default NewStocksPage;