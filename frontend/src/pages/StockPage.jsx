import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import stockService from '../services/stockService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from the URL
  const [stock, setStock] = useState(null);
  const [price, setPrice] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Fetch stock information
        const stockInfo = await stockService.getStock(symbol);
        /*
        * The `stockInfo` object has the following structure:
        * {
        * {"stock_symbol":"AGHOL","name":"Anadolu Grubu Holding","sector_id":1,"market_cap":73000000000.0,"last_updated":"2025-01-15T10:52:07"}
        * }
        */
        setStock(stockInfo);

        // Log stock information for debugging
        console.log('Stock Info:', stockInfo);

        // Fetch stock price data in the specified date range
        const priceResponse = await stockService.getStockPriceInDateRange({
          stock_symbol: stockInfo.stock_symbol,
          start_date: '2024-06-03',
          end_date: '2025-01-14',
        });
        /*
            sample response:
            [
                {"stock_symbol":"AGHOL","date":"2024-06-03","close_price":10.0},
                {"stock_symbol":"AGHOL","date":"2024-06-04", "close_price":11.0},
                {"stock_symbol":"AGHOL","date":"2024-06-05","close_price":12.0},
                ...
            ]
        */


        // Find the most recent close price
        const recentPrice = priceResponse.reverse().find(price => price.close_price !== null);
        setPrice(recentPrice ? recentPrice.close_price : 'N/A');

        // Prepare chart data
        const labels = priceResponse.map(price => price.date);
        const data = priceResponse.map(price => price.close_price);

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
          callback: value => `$${value}`,
        },
      },
    },
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {stock.name} ({stock.stock_symbol}) - ${price}
        </Typography>
        <Box sx={{ height: 400 }}>
          {chartData ? <Line options={chartOptions} data={chartData} /> : <Typography>No data available</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default StockPage;
