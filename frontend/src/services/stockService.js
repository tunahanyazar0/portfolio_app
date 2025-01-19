import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api/stocks';


const stockService = {
  getStock: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${symbol}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createStock: async (stock) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, stock);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Updated service to fetch stock general info using the /info endpoint
  getStockInfo: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${symbol}/info`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // to fetch the current stock price
  getStockPrice: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${symbol}/price`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // to fetch the stock price in a date range 
  getStockPriceInDateRange: async (request) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/prices-range`, request);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getFinancialData: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/financials/${symbol}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getBalanceSheetData: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/balance-sheet/${symbol}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getCashFlowData: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cash-flow/${symbol}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default stockService;
