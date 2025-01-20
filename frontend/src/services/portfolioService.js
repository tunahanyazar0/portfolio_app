import axios from 'axios';

/*
Note that:
    - from the backend, we receive the average bought price of each holding, not the current price.
    - for this, we use stock service and for kar zarar calculations, we do these in the frontend side.
*/
class PortfolioService {
    constructor() {
        this.apiURL = 'http://localhost:8001/api/stocks';
    }

    // Create a new portfolio for a user but no holding inside for now
    async createPortfolio(userId, name) {
        const response = await axios.post(`${this.apiURL}/portfolios`, { user_id: userId, name });
        return response.data;
    }

    // to return a portfolio with the given id but basic info not holdings inside
    async getPortfolio(portfolioId) {
        const response = await axios.get(`${this.apiURL}/portfolios/${portfolioId}`);
        return response.data;
    }

    // to return all portfolios of a user
    async getUserPortfolios(userId) {
        const response = await axios.get(`${this.apiURL}/portfolios/user/${userId}`);
        return response.data;
    }

    // to return holdings in a portfolio : get_portfolio_holdings
    // example url: http://localhost:8001/api/stocks/portfolios/1/holdings
    async getPortfolioHoldings(portfolioId) {
        if (!portfolioId) throw new Error('Portfolio ID is required');
        const response = await axios.get(`${this.apiURL}/portfolios/${portfolioId}/holdings`);
        return response.data;
    }

    // to add a holding to a portfolio with the given id
    async addHolding(portfolioId, symbol, quantity, price) {
        const response = await axios.post(`${this.apiURL}/portfolios/${portfolioId}/add/holdings`, {
            symbol,
            quantity,
            price
        });
        return response.data;
    }

    // to update a holding in a portfolio
    async updateHolding(holdingId, quantity, price) {
        const response = await axios.put(`${this.apiURL}/portfolios/holdings/update/${holdingId}`, {
            quantity,
            price
        });
        return response.data;
    }

    // to delete a holding in a portfolio with the given holding id
    async deleteHolding(holdingId) {
        const response = await axios.delete(`${this.apiURL}/portfolios/holdings/delete/${holdingId}`);
        return response.data;
    }
}

export default new PortfolioService();
