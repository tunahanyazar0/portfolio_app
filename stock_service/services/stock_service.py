from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import date
from decimal import Decimal
from typing import List, Optional

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

    def add_stock_price(self, symbol: str, date: date, open_price: Decimal, 
                       close_price: Decimal, high_price: Decimal, low_price: Decimal, 
                       volume: int) -> StockPrice:
        stock_price = StockPrice(
            stock_symbol=symbol,
            date=date,
            close_price=close_price  # Note: StockPrice model only has close_price now
        )
        self.db.add(stock_price)
        self.db.commit()
        self.db.refresh(stock_price)
        return stock_price

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