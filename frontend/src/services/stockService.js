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
  /*
    It returns a dictionary like this:
      {
        "stock_symbol": "AGHOL",
        "date": "2025-01-20",
        "close_price": "314.5"
      }
  */
  getStockPrice: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${symbol}/price`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // example url: http://localhost:8001/api/stocks/sector/aghol
  // example response: { "name": "Conglomerates", "sector_id": 1}
  getSectorOfStock: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sector/${symbol}`);
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

  /*
    example request url: http://localhost:8001/api/stocks/search/ag
    example output:
    [
      {
        "stock_symbol": "AGHOL",
        "name": "Anadolu Grubu Holding",
        "sector_id": 1,
        "market_cap": 73000000000,
        "last_updated": "2025-01-15T10:52:07"
      },
      {
        "stock_symbol": "MPARK",
        "name": "MLP Saglik Hizmetleri A.S.",
        "sector_id": 4,
        "market_cap": 75449737216,
        "last_updated": "2025-01-19T15:42:55"
      }
    ]

  */
  searchStocks: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/${query}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // requested url: http://localhost:8001/api/stocks/stocks-all/{symbol}
  getAllStocksDetailed: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks-all/x`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // http://localhost:8001/api/stocks/sectors-all/{symbol}
  /*
    example response:
      [
        {
          "sector_id": 2,
          "name": "Airlines"
        },
        {
          "sector_id": 7,
          "name": "Banks - Regional"
        },
        {
          "sector_id": 3,
          "
          name": "Asset Management"
        },
      ]

  */
  getAllSectors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sectors-all/x`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

};

export default stockService;
