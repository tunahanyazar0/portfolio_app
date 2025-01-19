import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper, ListItemText, ListItem, List, IconButton, Drawer } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import stockService from '../services/stockService';
import BarChart from '../components/BarChart';
import Sidebar from '../components/Sidebar';
import { useRef } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from the URL
  const [stock, setStock] = useState(null); // to store the basic info of the stock
  const [stockInfo, setStockInfo] = useState(null); // to store the general info of the stock
  const [price, setPrice] = useState(null); // to store the most recent stock price 
  const [chartData, setChartData] = useState(null); // to store the stock price data for the chart
  const [loading, setLoading] = useState(true);

  // income statement related 
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [operatingIncomeChartData, setOperatingIncomeChartData] = useState(null);
  const [operatingMarginChartData, setOperatingMarginChartData] = useState(null);
  const [grossProfitChartData, setGrossProfitChartData] = useState(null);
  const [netProfitChartData, setNetProfitChartData] = useState(null);
  
  // balance sheet related
  const [totalAssetsChartData, setTotalAssetsChartData] = useState(null);
  const [totalLiabilitiesChartData, setTotalLiabilitiesChartData] = useState(null);
  const [totalEquityChartData, setTotalEquityChartData] = useState(null);
  const [currentAssetsChartData, setCurrentAssetsChartData] = useState(null);
  const [currentLiabilitiesChartData, setCurrentLiabilitiesChartData] = useState(null);

  // cash flow statement related
  const [freeCashFlowChartData, setFreeCashFlowChartData] = useState(null);

  // Sidebar related
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Fields for navigation
  const fields = [
    { id: 'price-info', label: 'Price Info' },
    { id: 'general-info', label: 'General Info' },
    { id: 'ratios', label: 'Ratios' },
    { id: 'price', label: 'Price Details' },
    { id: 'debt-ratios', label: 'Debt Ratios' },
    { id: 'charts', label: 'Financial Charts' },
    { id: 'balance-sheet', label: 'Balance Sheet' },
    { id: 'cash-flow', label: 'Cash Flow' },
  ];

  // Refs for navigation
  const priceInfoRef = useRef(null);
  const generalInfoRef = useRef(null);
  const ratiosRef = useRef(null);
  const priceRef = useRef(null);
  const debtRatiosRef = useRef(null);
  const chartsRef = useRef(null);
  const balanceSheetRef = useRef(null);
  const cashFlowRef = useRef(null);

  const refs = {
    'price-info': priceInfoRef,
    'general-info': generalInfoRef,
    'ratios': ratiosRef,
    'price': priceRef,
    'debt-ratios': debtRatiosRef,
    'charts': chartsRef,
    'balance-sheet': balanceSheetRef,
    'cash-flow': cashFlowRef,
  };

  const handleNavigate = (id) => {
    const targetRef = refs[id];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // get the stock from the db
        const stock = await stockService.getStock(symbol);
        /*
        example output:
        {"stock_symbol":"AGHOL","name":"Anadolu Grubu Holding","sector_id":1,"market_cap":73000000000.0,"last_updated":"2025-01-15T10:52:07"}
        */
        
        // if stock is not in the database, set the stock to null and return the jsx below
        if (!stock) {
            setStock(null);
            setLoading(false);
            return;
          }

        setStock(stock);

        // Fetch stock general info
        const stockInfo = await stockService.getStockInfo(symbol);
        if(!stockInfo) {
          setStock(null);
          setLoading(false);
          return;
        }
        setStockInfo(stockInfo);

        // Fetch the most recent stock price
        const priceData = await stockService.getStockPrice(symbol);
        setPrice(priceData.close_price);

        // Fetch price data for the chart
        const priceResponse = await stockService.getStockPriceInDateRange({
          stock_symbol: symbol,
          start_date: '2024-01-14',
          end_date: '2025-01-14',
        });

        // we need to reverse the data to make the recent one to the right
        priceResponse.reverse();

        // Prepare chart data
        const labels = priceResponse.map(price => price.date);
        const data = priceResponse.map(price => price.close_price);

        /*
        example priceResponse:
        [
          {"stock_symbol": "AGHOL",
          "date":"2024-06-03
            ,"close_price":null},
            {"stock_symbol": "AGHOL",
            "date":"2024-06-04
            ,"close_price":null},
            {"stock_symbol": "AGHOL",
            "date":"2024-06-05
            ,"close_price":null}
    ]
        */

        // we need to reverse them to make the recent one to the right
        labels.reverse();
        data.reverse();

        setChartData({
          labels,
          datasets: [
            {
              label: `${stock.name} Stock Price`,
              data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        });

        // Fetch financial data for the stock
        const financialData = await stockService.getFinancialData(stock.stock_symbol);

        // Prepare income statement chart data
        const financialLabels = financialData.map(financial => financial.quarter);
        setRevenueChartData({
          labels: financialLabels,
          datasets: [
            {
              label: 'Revenue',
              data: financialData.map(financial => financial.revenue),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setOperatingIncomeChartData({
          labels: financialLabels,
          datasets: [
            {
              label: 'Operating Income',
              data: financialData.map(financial => financial.operating_income),
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
        setOperatingMarginChartData({
          labels: financialLabels,
          datasets: [
            {
              label: 'Operating Margin',
              data: financialData.map(financial => financial.operating_margin),
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        });
        setGrossProfitChartData({
          labels: financialLabels,
          datasets: [
            {
              label: 'Gross Profit',
              data: financialData.map(financial => financial.gross_profit),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
        setNetProfitChartData({
          labels: financialLabels,
          datasets: [
            {
              label: 'Net Profit',
              data: financialData.map(financial => financial.net_profit),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Fetch balance sheet data for the stock
        const balanceSheetData = await stockService.getBalanceSheetData(stock.stock_symbol);

        // Prepare balance sheet chart data
        const balanceSheetLabels = balanceSheetData.map(balanceSheet => balanceSheet.quarter);
        setTotalAssetsChartData({
          labels: balanceSheetLabels,
          datasets: [
            {
              label: 'Total Assets',
              data: balanceSheetData.map(balanceSheet => balanceSheet.total_assets),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setTotalLiabilitiesChartData({
          labels: balanceSheetLabels,
          datasets: [
            {
              label: 'Total Liabilities',
              data: balanceSheetData.map(balanceSheet => balanceSheet.total_liabilities),
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
        setTotalEquityChartData({
          labels: balanceSheetLabels,
          datasets: [
            {
              label: 'Total Equity',
              data: balanceSheetData.map(balanceSheet => balanceSheet.total_equity),
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        });
        setCurrentAssetsChartData({
          labels: balanceSheetLabels,
          datasets: [
            {
              label: 'Current Assets',
              data: balanceSheetData.map(balanceSheet => balanceSheet.current_assets),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
        setCurrentLiabilitiesChartData({
          labels: balanceSheetLabels,
          datasets: [
            {
              label: 'Current Liabilities',
              data: balanceSheetData.map(balanceSheet => balanceSheet.current_liabilities),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Fetch cash flow data for the stock
        const cashFlowData = await stockService.getCashFlowData(stock.stock_symbol);

        // Prepare cash flow chart data
        const cashFlowLabels = cashFlowData.map(cashFlow => cashFlow.quarter);
        setFreeCashFlowChartData({
          labels: cashFlowLabels,
          datasets: [
            {
              label: 'Free Cash Flow',
              data: cashFlowData.map(cashFlow => cashFlow.free_cash_flow),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `Stock Performance of (TL) (${stock?.stock_symbol})`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: context => {
            const value = context.raw;
            return typeof value === 'number' ? `TL ${value.toFixed(2)}` : value;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (TL)',
        },
        ticks: {
          callback: value => `${value} TL`,
        },
      },
    },
  };

  // the case where the stock is being fetched
  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // the case where the stock is not in the database or the stock is not found
  if (!stock) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Stock not found
          </Typography>
        </Box>
      </Container>
    );
  }


  // else, render the stock page
  return (
    <Container>
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        fields={fields}
        onNavigate={handleNavigate}
      />

      {/* Stock Price Section */}
      <Box ref={priceInfoRef} sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {stock.name} ({stock.stock_symbol}) - {price} TL
            </Typography>
            <Box sx={{ height: 400 }}>
              {chartData ? <Line options={chartOptions} data={chartData} /> : <Typography>No data available</Typography>}
            </Box>
          </Paper>
      </Box>


        {/* General Info Section */}
        <Box ref={generalInfoRef} sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          General Information
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="body1"><strong>Sector:</strong> {stockInfo.sector}</Typography>
              <Typography variant="body1"><strong>Employees:</strong> {stockInfo.fullTimeEmployees}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {stockInfo.longBusinessSummary}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>


        {/* Ratios Section */}
        <Box ref={ratiosRef} sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ratios
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="body1"><strong>Beta:</strong> {stockInfo.beta}</Typography>
              <Typography variant="body1"><strong>Trailing PE:</strong> {stockInfo.trailingPE}</Typography>
              <Typography variant="body1"><strong>Forward PE:</strong> {stockInfo.forwardPE}</Typography>
              <Typography variant="body1"><strong>Price to Sales:</strong> {stockInfo.priceToSalesTrailing12Months}</Typography>
              <Typography variant="body1"><strong>Profit Margins:</strong> {stockInfo.profitMargins}</Typography>
              <Typography variant="body1"><strong>Book Value:</strong> {stockInfo.bookValue}</Typography>
              <Typography variant="body1"><strong>Price to Book:</strong> {stockInfo.priceToBook}</Typography>
              <Typography variant="body1"><strong>Trailing EPS:</strong> {stockInfo.trailingEps}</Typography>
              <Typography variant="body1"><strong>Forward EPS:</strong> {stockInfo.forwardEps}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

        {/* Price Section */}
        <Box ref={priceRef} sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Price Details
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="body1"><strong>Previous Close:</strong> {stockInfo.regularMarketPreviousClose}</Typography>
              <Typography variant="body1"><strong>52 Week Low:</strong> {stockInfo.fiftyTwoWeekLow}</Typography>
              <Typography variant="body1"><strong>52 Week High:</strong> {stockInfo.fiftyTwoWeekHigh}</Typography>
              <Typography variant="body1"><strong>50 Day Avg:</strong> {stockInfo.fiftyDayAverage}</Typography>
              <Typography variant="body1"><strong>200 Day Avg:</strong> {stockInfo.twoHundredDayAverage}</Typography>
              <Typography variant="body1"><strong>52 Week Change:</strong> {stockInfo['52WeekChange']}</Typography>
              <Typography variant="body1"><strong>Target High:</strong> {stockInfo.targetHighPrice}</Typography>
              <Typography variant="body1"><strong>Target Low:</strong> {stockInfo.targetLowPrice}</Typography>
              <Typography variant="body1"><strong>Mean Target:</strong> {stockInfo.targetMeanPrice}</Typography>
              <Typography variant="body1"><strong>Recommendation:</strong> {stockInfo.recommendationKey}</Typography>
              <Typography variant="body1"><strong>Analyst Opinions:</strong> {stockInfo.numberOfAnalystOpinions}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

        {/* Debt Ratios Section */}
        <Box ref={debtRatiosRef} sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Debt Ratios
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2  }}>
              <Typography variant="body1"><strong>Total Debt:</strong> {stockInfo.totalDebt}</Typography>
              <Typography variant="body1"><strong>Quick Ratio:</strong> {stockInfo.quickRatio}</Typography>
              <Typography variant="body1"><strong>Current Ratio:</strong> {stockInfo.currentRatio}</Typography>
              <Typography variant="body1"><strong>Debt to Equity:</strong> {stockInfo.debtToEquity}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

        {/* Financial Charts Section */}
        <Box ref={chartsRef} sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
            Financial Charts
          </Typography>
        <Grid container spacing={4}>
          {revenueChartData && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <BarChart title="Revenue per Quarter" data={revenueChartData} unit="TL" />
              </Paper>
            </Grid>
          )}
          {operatingIncomeChartData && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <BarChart title="Operating Income per Quarter" data={operatingIncomeChartData} unit="TL" />
              </Paper>
            </Grid>
          )}
            {operatingMarginChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Operating Margin per Quarter" data={operatingMarginChartData} unit="%" />
                </Paper>
                </Grid>
            )}
            {grossProfitChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Gross Profit per Quarter" data={grossProfitChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
            {netProfitChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Net Profit per Quarter" data={netProfitChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
        </Grid>
      </Box>


      <Box ref={balanceSheetRef} sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
          Balance Sheet Charts  
          </Typography>
        <Grid container spacing={4}>
            {/* Balance Sheet Section */}
            {totalAssetsChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Total Assets per Quarter" data={totalAssetsChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
            {totalLiabilitiesChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Total Liabilities per Quarter" data={totalLiabilitiesChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
            {totalEquityChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Total Equity per Quarter" data={totalEquityChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
            {currentAssetsChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Current Assets per Quarter" data={currentAssetsChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
            {currentLiabilitiesChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Current Liabilities per Quarter" data={currentLiabilitiesChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
        </Grid>
      </Box>

            
            {/* Cash Flow Section */}
        <Box ref={cashFlowRef} sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Cash Flow Charts
          </Typography>
        <Grid container spacing={4}>
            {freeCashFlowChartData && (
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <BarChart title="Free Cash Flow per Quarter" data={freeCashFlowChartData} unit="TL" />
                </Paper>
                </Grid>
            )}
        </Grid>
      </Box>
    </Container>
  );
};

export default StockPage;