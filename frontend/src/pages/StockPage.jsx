import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import stockService from '../services/stockService';
import BarChart from '../components/BarChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from the URL
  const [stock, setStock] = useState(null);
  const [price, setPrice] = useState(null);
  const [chartData, setChartData] = useState(null);
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

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Fetch stock information
        const stockInfo = await stockService.getStock(symbol);
        /*
        example output:
        {"stock_symbol":"AGHOL","name":"Anadolu Grubu Holding","sector_id":1,"market_cap":73000000000.0,"last_updated":"2025-01-15T10:52:07"}
        */
        
        // if stock is not in the database, set the stock to null and return the jsx below
        if (!stockInfo) {
            setStock(null);
            setLoading(false);
            return;
          }

        setStock(stockInfo);

        // Log stock information for debugging
        console.log('Stock Info:', stockInfo);

        // Fetch stock price data in the specified date range
        const priceResponse = await stockService.getStockPriceInDateRange({
          stock_symbol: stockInfo.stock_symbol,
          start_date: '2024-06-03',
          end_date: '2025-01-14',
        });

        // Find the most recent close price
        const recentPrice = priceResponse.reverse().find(price => price.close_price !== null);
        setPrice(recentPrice ? recentPrice.close_price : 'N/A');

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
              label: `${stockInfo.name} Stock Price`,
              data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        });

        // Fetch financial data for the stock
        const financialData = await stockService.getFinancialData(stockInfo.stock_symbol);

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
        const balanceSheetData = await stockService.getBalanceSheetData(stockInfo.stock_symbol);

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
        const cashFlowData = await stockService.getCashFlowData(stockInfo.stock_symbol);

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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {stock.name} ({stock.stock_symbol}) - ${price}
        </Typography>
        <Box sx={{ height: 400 }}>
          {chartData ? <Line options={chartOptions} data={chartData} /> : <Typography>No data available</Typography>}
        </Box>
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