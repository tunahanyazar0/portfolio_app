from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, DECIMAL, FLOAT, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.db_context import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(Enum('admin', 'user', 'moderator', name='user_roles'), nullable=False, default='user')
    
    portfolios = relationship("Portfolio", back_populates="user")

class Sector(Base):
    __tablename__ = "sectors"
    
    sector_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    
    stocks = relationship("Stock", back_populates="sector")

class Stock(Base):
    __tablename__ = "stocks"
    
    stock_symbol = Column(String(10), primary_key=True)
    name = Column(String(255), nullable=False)
    sector_id = Column(Integer, ForeignKey('sectors.sector_id'), nullable=False)
    market_cap = Column(DECIMAL(20, 2))
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    sector = relationship("Sector", back_populates="stocks")
    financials = relationship("Financial", back_populates="stock")
    balance_sheets = relationship("BalanceSheet", back_populates="stock")
    cash_flows = relationship("CashFlow", back_populates="stock")
    dividends = relationship("Dividend", back_populates="stock")
    prices = relationship("StockPrice", back_populates="stock")
    holdings = relationship("PortfolioHolding", back_populates="stock")

class Financial(Base):
    __tablename__ = "financials"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    revenue = Column(DECIMAL(20, 2))
    gross_profit = Column(DECIMAL(20, 2))  # Added gross profit
    operating_income = Column(DECIMAL(20, 2))  # Added operating income
    net_profit = Column(DECIMAL(20, 2))
    eps = Column(FLOAT)
    operating_margin = Column(FLOAT)  # Added operating margin (%)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="financials")


class BalanceSheet(Base):
    __tablename__ = "balance_sheets"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    total_assets = Column(DECIMAL(20, 2))
    total_liabilities = Column(DECIMAL(20, 2))  # Added total liabilities
    total_equity = Column(DECIMAL(20, 2))  # Added total equity
    current_assets = Column(DECIMAL(20, 2))  # Added current assets
    current_liabilities = Column(DECIMAL(20, 2))  # Added current liabilities
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="balance_sheets")


class CashFlow(Base):
    __tablename__ = "cash_flows"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    operating_cash_flow = Column(DECIMAL(20, 2))
    investing_cash_flow = Column(DECIMAL(20, 2))  # Added investing cash flow
    financing_cash_flow = Column(DECIMAL(20, 2))  # Added financing cash flow
    free_cash_flow = Column(DECIMAL(20, 2))  # Added free cash flow
    capital_expenditures = Column(DECIMAL(20, 2))  # Added capital expenditures
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="cash_flows")

class Dividend(Base):
    __tablename__ = "dividends"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    payment_date = Column(Date, nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="dividends")

class StockPrice(Base):
    __tablename__ = "stock_prices"
    
    price_id = Column(Integer, primary_key=True, autoincrement=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    date = Column(Date, nullable=False)
    close_price = Column(DECIMAL(10, 2))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stock = relationship("Stock", back_populates="prices")

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    portfolio_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="portfolios")
    holdings = relationship("PortfolioHolding", back_populates="portfolio")

class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"
    
    holding_id = Column(Integer, primary_key=True, autoincrement=True)
    portfolio_id = Column(Integer, ForeignKey('portfolios.portfolio_id'), nullable=False)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    average_price = Column(DECIMAL(10, 2))
    added_at = Column(DateTime, default=datetime.utcnow)
    
    portfolio = relationship("Portfolio", back_populates="holdings")
    stock = relationship("Stock", back_populates="holdings")