// BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

// this is the bar chart component that will be used in stock page

const BarChart = ({ title, data, unit }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      /*
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },*/
      tooltip: {
        callbacks: {
          label: context => {
            const value = context.raw;
            return typeof value === 'number' ? `${value.toFixed(2)} ${unit}` : value;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: unit,
        },
        ticks: {
          callback: value => `${value} ${unit}`,
        },
      },
    },
  };

  return (
    <Box sx={{ height: 400, mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default BarChart;