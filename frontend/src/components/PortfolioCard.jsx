import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import stockService from '../services/stockService';

const PortfolioCard = ({ portfolio }) => {
  const navigate = useNavigate();
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#FF00FF', '#00FF00', '#008080', '#800080', '#808000'];

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!portfolio.portfolio_id) {
        console.error('Portfolio ID is missing for portfolio:', portfolio);
        setLoading(false);
        return;
      }

      try {
        const holdings = await portfolioService.getPortfolioHoldings(
          portfolio.portfolio_id
        );

        const data = await Promise.all(
          holdings.map(async (holding) => {
            const stockPriceInfo = await stockService.getStockPrice(
              holding.stock_symbol
            );

            // Calculate market value
            const marketValue =
              stockPriceInfo.close_price * holding.quantity;
            return {
              name: holding.stock_symbol,
              value: marketValue,
              marketValue: marketValue.toFixed(2),
            };
          })
        );

        setPieData(data);
      } catch (error) {
        console.error('Error fetching portfolio holdings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [portfolio.portfolio_id]);

  return (
    <Card
      sx={{
        borderRadius: 6,
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: 800, // Adjusted width to be bigger
        minHeight: 600, // Increased height to accommodate more content
        margin: '2rem auto', // Added margin for better spacing
        padding: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontWeight: 300, mb: 4, textAlign: 'center' }}
        >
          {portfolio.name || 'Unnamed Portfolio'}
        </Typography>

        <Box sx={{ height: 350 }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : pieData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100} // Increased size for better spacing
                  innerRadius={50}
                  label={({ name, value }) =>
                    `${name}: ${value.toFixed(2)} TL`
                  }
                  labelLine={{
                    stroke: '#ccc',
                    strokeWidth: 1,
                    length: 5, // Adds more spacing between chart and labels
                  }}
                  isAnimationActive
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) =>
                    `${props.payload.name}: ${value.toFixed(2)} TL`
                  }
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  wrapperStyle={{
                    marginTop: 10,
                    padding: 5,
                  }}
                  formatter={(value) => (
                    <span style={{ fontSize: 14, color: '#333' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
            >
              No holdings to display.
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={() => navigate(`/portfolios/${portfolio.portfolio_id}`)}
          disabled={!portfolio.portfolio_id}
          sx={{ marginTop: 2 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PortfolioCard;
