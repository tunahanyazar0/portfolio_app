from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import date
from decimal import Decimal
from typing import List, Optional
import yfinance as yf  # New import
from datetime import datetime  # New import
import pandas as pd

from models.models import Stock, Sector, Portfolio, PortfolioHolding, StockPrice

class StockService:
    def __init__(self, db: Session):
        self.db = db

    def create_stock(self, symbol: str, name: str, sector: str, market_cap: Decimal) -> Stock:
        # First get or create sector
        sector_obj = self.db.query(Sector).filter(Sector.name == sector).first()
        if not sector_obj:
            sector_obj = Sector(name=sector)
            self.db.add(sector_obj)
            self.db.commit()
            self.db.refresh(sector_obj)

        # Check if stock with same symbol or name exists
        stock_exists = self.db.query(Stock).filter(
            (Stock.stock_symbol == symbol) | (Stock.name == name)
        ).first()
        if stock_exists:
            if stock_exists.stock_symbol == symbol:
                raise ValueError(f"Stock with symbol {symbol} already exists")
            else:
                raise ValueError(f"Stock with name {name} already exists")

        # create the stock object 
        stock = Stock(
            stock_symbol=symbol,
            name=name,
            sector_id=sector_obj.sector_id,
            market_cap=market_cap
        )
        self.db.add(stock)
        self.db.commit()
        self.db.refresh(stock)
        return stock

    def get_stock(self, symbol: str) -> Optional[Stock]:
        return self.db.query(Stock).filter(Stock.stock_symbol == symbol).first()

    def get_all_stocks(self) -> List[Stock]:
        return self.db.query(Stock).all()

    
    def add_stock_price(self, stock_symbol: str, start_date: str, end_date: str):
        try:    
            # first check stock is in stocks db
            stock = self.db.query(Stock).filter(Stock.stock_symbol == stock_symbol).first()
            if stock is None:
                raise ValueError(f"Stock with symbol {stock_symbol} does not exists")

            # date, symbol comb uniqueness satisfied thorugh db definition
            # then, start adding data
            stock_symbol = stock_symbol.upper()

            # add .IS to the end of the stock symbol since yahoo finance excepts that
            stock_symbol += ".IS"
            # Fetch stock data using yfinance 
            stock_data = yf.download(stock_symbol, start=start_date, end=end_date)

            # Check if data is available
            if stock_data.empty:
                print(f"No data available for {stock_symbol} from {start_date} to {end_date}")
                return
            
            prices = []
            dates = []

            # Iterate through the data and add closing prices
            for date, row in stock_data.iterrows():
                # check whether the las

                # Extract the Close price explicitly using multi-index handling
                if 'Close' in row.index:
                    close_price_series = row['Close']
                    # Ensure close_price is the specific value for the stock
                    if isinstance(close_price_series, pd.Series):
                        close_price = close_price_series.get(stock_symbol, None)
                    else:
                        close_price = close_price_series
                else:
                    close_price = None

                #print(date)
                #print(close_price)
                prices.append(close_price)
                dates.append(date)

            stock_symbol = stock_symbol[:-3]
            for price, date in zip(prices, dates):
                # there is no null data in prices

                # Convert to Decimal for compatibility with DECIMAL(10, 2)
                close_price = Decimal(f"{price:.2f}")

                # Add the stock price record to the database
                stock_price = StockPrice(
                    stock_symbol=stock_symbol,
                    date=date.date(),  # Convert timestamp to date
                    close_price=close_price,  # Store as Decimal
                )
                self.db.add(stock_price)
            
            # Commit all new records to the database
            self.db.commit()  # Moved this line to commit after adding all prices
            print(f"Closing prices for {stock_symbol} added successfully.")

        except Exception as e:
            self.db.rollback()  # Rollback in case of an error
            print(f"An error occurred while adding stock prices: {e}")
    
    def get_stock_price_on_date(self, stock_symbol: str, date: str) -> Optional[Decimal]:
        """Retrieve the stock price for a given stock symbol on a specific date."""
        stock_price = self.db.query(StockPrice).filter(
            StockPrice.stock_symbol == stock_symbol,
            StockPrice.date == date
        ).first()
        
        if stock_price:
            return stock_price.close_price
        return None

    def create_portfolio(self, user_id: int, name: str) -> Portfolio:
        portfolio = Portfolio(
            user_id=user_id,
            name=name
        )
        self.db.add(portfolio)
        self.db.commit()
        self.db.refresh(portfolio)
        return portfolio

    def add_holding(self, portfolio_id: int, symbol: str, quantity: int, price: Decimal) -> PortfolioHolding:
        holding = PortfolioHolding(
            portfolio_id=portfolio_id,
            stock_symbol=symbol,
            quantity=quantity,
            average_price=price
        )
        self.db.add(holding)
        self.db.commit()
        self.db.refresh(holding)
        return holding

    def get_portfolio(self, portfolio_id: int) -> Optional[Portfolio]:
        return self.db.query(Portfolio).filter(Portfolio.portfolio_id == portfolio_id).first()

    def get_user_portfolios(self, user_id: int) -> List[Portfolio]:
        return self.db.query(Portfolio).filter(Portfolio.user_id == user_id).all()

    def update_holding(self, holding_id: int, quantity: int, price: Decimal) -> Optional[PortfolioHolding]:
        holding = self.db.query(PortfolioHolding).filter(PortfolioHolding.holding_id == holding_id).first()
        if holding:
            holding.quantity = quantity
            holding.average_price = price
            self.db.commit()
            self.db.refresh(holding)
        return holding

    def delete_holding(self, holding_id: int) -> bool:
        holding = self.db.query(PortfolioHolding).filter(PortfolioHolding.holding_id == holding_id).first()
        if holding:
            self.db.delete(holding)
            self.db.commit()
            return True
        return False