import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api/stocks';

const stockService = {
  createStock: async (stock) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, stock);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getStock: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${symbol}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getAllStocks: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addStockPrices: async (stockPriceInput) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${stockPriceInput.stock_symbol}/add-price`, stockPriceInput);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getStockPrice: async (request) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/price`, request);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getStockPriceInDateRange: async (request) => {    
    try {
        const response = await axios.post(`${API_BASE_URL}/prices`, request);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
    },

  createPortfolio: async (portfolio) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/portfolios`, portfolio);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getPortfolio: async (portfolioId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolios/${portfolioId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getUserPortfolios: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolios/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addHolding: async (portfolioId, holding) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/portfolios/${portfolioId}/holdings`, holding);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateHolding: async (holdingId, holding) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/portfolios/holdings/${holdingId}`, holding);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteHolding: async (holdingId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/portfolios/holdings/${holdingId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default stockService;