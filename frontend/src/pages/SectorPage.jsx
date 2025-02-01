import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import stockService from '../services/stockService';
import { useParams } from 'react-router-dom';
// for news about the sector
import newsService from '../services/newsService';
import NewsSection from '../components/NewsSection';
// theme
import { useTheme } from '@mui/material/styles';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

const SectorPage = () => {
  const { sectorId } = useParams();
  const [sectorInfo, setSectorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // for news about the sector
  const [news, setNews] = useState([]);
  // theme
  const theme = useTheme();

  useEffect(() => {
    console.log("here -1");
    const fetchSectorInfo = async () => {
      try {
        const data = await stockService.getSectorInfo(sectorId);
        /*
          data is sth like:
          {
            sector: {
              name: "Technology",
              ...
            },
            number_of_companies: 3,
            total_market_cap: 1000000000,
            top_3_companies: [
              {
                stock_symbol: "AAPL",
                name: "Apple Inc.",
                market_cap: 500000000,
                last_updated: "2021-10-01T00:00:00Z"
              },
              ...
            ]
          }
        */
        setSectorInfo(data);
        console.log(sectorInfo);
      } catch (error) {
        console.error('Error fetching sector info:', error);
      } finally {
        setLoading(false);
      }
    };

    // fetch sector info first
    fetchSectorInfo();
  }, [sectorId]); // run this effect every time sectorId changes

  // fetching news about the sector is done every time the component is rendered
  useEffect(() => {
    // fetch news about the sector by its name
    const fetchNews = async () => {
      try {
        console.log("here 1");
        const name_of_the_sector = sectorInfo.sector.name;
        console.log("name of the sector: ", name_of_the_sector);
        const data = await newsService.getNewsAboutSector(name_of_the_sector);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news about sector:', error);
      }
    };

    if (sectorInfo) {
      console.log("here 2");
      fetchNews();
    }
  }, [sectorInfo]); // run this effect every time sectorInfo changes
    

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!sectorInfo) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Failed to load sector information. Please try again later.
        </Typography>
      </Container>
    );
  }

  const { sector, number_of_companies, total_market_cap, top_3_companies } = sectorInfo;

  return (
    <Container sx={{ mt: 4 }}>
      {/* Sector Information */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          {sector.name} Sector Overview
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Companies:</strong> {number_of_companies}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Market Capitalization:</strong> {total_market_cap.toLocaleString()} TL
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Side: Top 3 Companies */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Top 3 Companies
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={top_3_companies.map((company) => ({
                    name: company.stock_symbol,
                    value: company.market_cap,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${(value / total_market_cap * 100).toFixed(1)}%`}
                >
                  {top_3_companies.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} TL`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Right Side: Stock Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Top Stocks in {sector.name}
            </Typography>
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Stock Symbol</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Market Cap (TL)</strong></TableCell>
                    <TableCell><strong>Last Updated</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {top_3_companies.map((company) => (
                    <TableRow key={company.stock_symbol}>
                      <TableCell>{company.stock_symbol}</TableCell>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.market_cap.toLocaleString()}</TableCell>
                      <TableCell>{new Date(company.last_updated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* News Section */}
      <NewsSection news={news} />

    </Container>
  );
};

export default SectorPage;
