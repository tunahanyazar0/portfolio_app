import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import stockService from '../services/stockService';

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

            /*
                each stock is sth like this:
                {
  "address1": "Fatih Sultan Mehmet Mahallesi, Kat 6",
  "address2": "Balkan Caddesi No. 58 Buyaka E Blok TepeUestUe Uemraniye",
  "city": "Istanbul",
  "zip": "34771",
  "country": "Turkey",
  "phone": "90 216 578 85 00",
  "fax": "90 216 573 74 52",
  "website": "https://www.anadolugrubu.com.tr",
  "industry": "Conglomerates",
  "industryKey": "conglomerates",
  "industryDisp": "Conglomerates",
  "sector": "Industrials",
  "sectorKey": "industrials",
  "sectorDisp": "Industrials",
  "longBusinessSummary": "AG Anadolu Grubu Holding A.S., together with its subsidiaries, engages in the beer, soft drinks, automotive, and other businesses in Turkey and internationally. The company operates through Beer, Soft Drinks, Migros, Automotive, Agriculture, Energy, and Industry, and Other segments. It also produces and sells beer and malt, and carbonated and non-carbonated beverages; and involved in passenger and commercial vehicles business. In addition, the company imports, distributes, markets, and rents motor vehicles; and engages in generators, and spares and component part activities. Further, it is involved in the production of industrial engines; sale of tractors; production of writing instruments; distribution of other imported stationery products; wholesale and retail sale of electricity, insurance agency business; and production, distribution, and transmission of electricity businesses, as well as operates distribution facilities; and provision of IT, internet, and e-commerce services. Additionally, the company purchases, sells, rents, and manages real estate properties; and leases intellectual property. AG Anadolu Grubu Holding A.S. was formerly known as Yazicilar Holding A.S. and changed its name to AG Anadolu Grubu Holding A.S. in December 2017. The company was founded in 1950 and is based in Istanbul, Turkey.",
  "fullTimeEmployees": 71587,
  "companyOfficers": [
    {
      "maxAge": 1,
      "name": "Mr. Burak  Basarir",
      "title": "Chief Executive Officer",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Onur  Çevikel",
      "title": "Chief Financial Officer",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Serkant  Paker",
      "title": "Chief Information Officer",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Mehmet  Colakoglu C.F.A.",
      "title": "Corporate Governance and Investor Relations Director",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Mustafa  Yelligedik",
      "title": "Legal Affairs President",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Atilla D. Yerlikaya",
      "title": "Head of Corporate Relations, Communications & Sustainability",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Osman  Alptürer",
      "age": 57,
      "title": "Human Resources President",
      "yearBorn": 1967,
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Mentes  Albayrak",
      "title": "Head of Audit",
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Bora  Koçak",
      "age": 55,
      "title": "Automotive Group President",
      "yearBorn": 1969,
      "exercisedValue": 0,
      "unexercisedValue": 0
    },
    {
      "maxAge": 1,
      "name": "Mr. Demir  Sarman",
      "title": "President of Agriculture, Energy & Industry Group",
      "exercisedValue": 0,
      "unexercisedValue": 0
    }
  ],
  "maxAge": 86400,
  "priceHint": 2,
  "previousClose": 313.25,
  "open": 313.5,
  "dayLow": 311.5,
  "dayHigh": 317,
  "regularMarketPreviousClose": 313.25,
  "regularMarketOpen": 313.5,
  "regularMarketDayLow": 311.5,
  "regularMarketDayHigh": 317,
  "dividendRate": 2.87,
  "dividendYield": 0.0091,
  "exDividendDate": 1716940800,
  "payoutRatio": 0.116000004,
  "fiveYearAvgDividendYield": 0.94,
  "beta": 0.206,
  "trailingPE": 12.722133,
  "forwardPE": 2.0841603,
  "volume": 606892,
  "regularMarketVolume": 606892,
  "averageVolume": 827643,
  "averageVolume10days": 776644,
  "averageDailyVolume10Day": 776644,
  "bid": 314.5,
  "ask": 314,
  "marketCap": 76713525248,
  "fiftyTwoWeekLow": 227.5,
  "fiftyTwoWeekHigh": 477.5,
  "priceToSalesTrailing12Months": 0.19654344,
  "fiftyDayAverage": 334.585,
  "twoHundredDayAverage": 342.1325,
  "currency": "TRY",
  "enterpriseValue": 258303164416,
  "profitMargins": 0.01544,
  "floatShares": 76352957,
  "sharesOutstanding": 243535008,
  "heldPercentInsiders": 0.53755003,
  "heldPercentInstitutions": 0.13204001,
  "impliedSharesOutstanding": 247848000,
  "bookValue": 367.557,
  "priceToBook": 0.8570099,
  "lastFiscalYearEnd": 1703980800,
  "nextFiscalYearEnd": 1735603200,
  "mostRecentQuarter": 1727654400,
  "earningsQuarterlyGrowth": -0.239,
  "netIncomeToCommon": 6016836096,
  "trailingEps": 24.76,
  "forwardEps": 151.14,
  "lastSplitFactor": "130:100",
  "lastSplitDate": 1171238400,
  "enterpriseToRevenue": 0.662,
  "enterpriseToEbitda": 10.56,
  "52WeekChange": 0.3478819,
  "SandP52WeekChange": 0.23809385,
  "lastDividendValue": 2.874336,
  "lastDividendDate": 1716940800,
  "exchange": "IST",
  "quoteType": "EQUITY",
  "symbol": "AGHOL.IS",
  "underlyingSymbol": "AGHOL.IS",
  "shortName": "ANADOLU GRUBU HOLDING",
  "longName": "AG Anadolu Grubu Holding A.S.",
  "firstTradeDateEpochUtc": 957940200,
  "timeZoneFullName": "Europe/Istanbul",
  "timeZoneShortName": "TRT",
  "uuid": "7c88d8eb-7086-33ec-b5e8-417838d9c214",
  "messageBoardId": "finmb_6523430",
  "gmtOffSetMilliseconds": 10800000,
  "currentPrice": 315,
  "targetHighPrice": 554,
  "targetLowPrice": 486.83,
  "targetMeanPrice": 520.415,
  "targetMedianPrice": 520.415,
  "recommendationMean": 1,
  "recommendationKey": "strong_buy",
  "numberOfAnalystOpinions": 2,
  "totalCash": 82623127552,
  "totalCashPerShare": 339.267,
  "ebitda": 24459929600,
  "totalDebt": 108534816768,
  "quickRatio": 0.656,
  "currentRatio": 1.069,
  "totalRevenue": 390313345024,
  "debtToEquity": 44.265,
  "revenuePerShare": 1605.42,
  "returnOnAssets": 0.0207,
  "returnOnEquity": 0.13712,
  "grossProfits": 109019947008,
  "freeCashflow": 636330112,
  "operatingCashflow": 35237277696,
  "earningsGrowth": -0.239,
  "revenueGrowth": 0.438,
  "grossMargins": 0.27931,
  "ebitdaMargins": 0.06267,
  "operatingMargins": 0.06564,
  "financialCurrency": "TRY",
  "trailingPegRatio": null
}

            */

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

  const handleSearch = (query) => {
    const filtered = stocks.filter(stock => 
      stock.stock_symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
    setSearchQuery(query);
  };

  // stock table ı içeren jsx i döndüren fonksiyon
  const renderStockTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Current Price</TableCell>
            <TableCell>Day Change %</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>1 Week %</TableCell>
            <TableCell>1 Month %</TableCell>
            <TableCell>3 Months %</TableCell>
            <TableCell>1 Year %</TableCell>
            <TableCell>3 Years %</TableCell>
            <TableCell>5 Years %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStocks.map(stock => (
            console.log(stock),
            <TableRow key={stock.stock_symbol}>
              <TableCell>{stock.stock_symbol}</TableCell>
              <TableCell>{stock.currentPrice?.toFixed(2)}</TableCell>
              <TableCell>{stock.regularMarketChangePercent?.toFixed(2)}%</TableCell>
              <TableCell>{stock.regularMarketVolume?.toLocaleString()}</TableCell>
              <TableCell>{stock.market_cap?.toFixed(2)}</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 7).toFixed(2)}%</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 30).toFixed(2)}%</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 90).toFixed(2)}%</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 365).toFixed(2)}%</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 3*365).toFixed(2)}%</TableCell>
              <TableCell>{calculatePercentageChange(stock.prices, 5*365).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

    // filters dialog ı içeren jsx i döndüren fonksiyon
  const renderFiltersDialog = () => (
    <Dialog 
      open={openFiltersDialog} 
      onClose={() => setOpenFiltersDialog(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Stock Filters</DialogTitle>
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


          {/* Similar TextField components for other filter categories */}
        </Grid>
      </DialogContent>
      <DialogActions>
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