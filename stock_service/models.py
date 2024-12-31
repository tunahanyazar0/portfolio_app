from sqlalchemy import (
    Column, Integer, String, Date, ForeignKey, Float, DECIMAL, DateTime, create_engine
)
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from datetime import datetime
import decimal
from typing import Optional, List


Base = declarative_base()

# 1. Stocks
class Stock(Base):
    __tablename__ = 'stocks'

    stock_symbol = Column(String(10), primary_key=True)
    name = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=False)
    market_cap = Column(DECIMAL(20, 2))
    last_updated = Column(DateTime, default=datetime.utcnow)

    financials = relationship("Financial", back_populates="stock", cascade="all, delete-orphan")
    balance_sheets = relationship("BalanceSheet", back_populates="stock", cascade="all, delete-orphan")
    cash_flows = relationship("CashFlow", back_populates="stock", cascade="all, delete-orphan")
    dividends = relationship("Dividend", back_populates="stock", cascade="all, delete-orphan")
    prices = relationship("StockPrice", back_populates="stock", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="stock")

    def __repr__(self):
        return f"<Stock(symbol={self.stock_symbol}, name={self.name})>"


# 2. Financials
class Financial(Base):
    __tablename__ = 'financials'

    id = Column(Integer, primary_key=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    revenue = Column(DECIMAL(20, 2), nullable=True)
    net_profit = Column(DECIMAL(20, 2), nullable=True)
    ebitda = Column(DECIMAL(20, 2), nullable=True)
    eps = Column(Float, nullable=True)
    free_cash_flow = Column(DECIMAL(20, 2), nullable=True)
    total_debt = Column(DECIMAL(20, 2), nullable=True)
    equity = Column(DECIMAL(20, 2), nullable=True)
    debt_to_equity_ratio = Column(Float, nullable=True)
    liquidation_value = Column(DECIMAL(20, 2), nullable=True)
    operating_margin = Column(Float, nullable=True)
    net_margin = Column(Float, nullable=True)
    return_on_equity = Column(Float, nullable=True)
    return_on_assets = Column(Float, nullable=True)
    current_ratio = Column(Float, nullable=True)
    quick_ratio = Column(Float, nullable=True)
    book_value_per_share = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    stock = relationship("Stock", back_populates="financials")

    def __repr__(self):
        return f"<Financial(stock={self.stock_symbol}, quarter={self.quarter})>"


# 3. BalanceSheet
class BalanceSheet(Base):
    __tablename__ = 'balance_sheet'

    id = Column(Integer, primary_key=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    total_assets = Column(DECIMAL(20, 2), nullable=True)
    total_liabilities = Column(DECIMAL(20, 2), nullable=True)
    inventory = Column(DECIMAL(20, 2), nullable=True)
    accounts_receivable = Column(DECIMAL(20, 2), nullable=True)
    accounts_payable = Column(DECIMAL(20, 2), nullable=True)
    cash = Column(DECIMAL(20, 2), nullable=True)
    short_term_debt = Column(DECIMAL(20, 2), nullable=True)
    long_term_debt = Column(DECIMAL(20, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    stock = relationship("Stock", back_populates="balance_sheets")

    def __repr__(self):
        return f"<BalanceSheet(stock={self.stock_symbol}, quarter={self.quarter})>"


# 4. CashFlow
class CashFlow(Base):
    __tablename__ = 'cash_flow'

    id = Column(Integer, primary_key=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quarter = Column(Date, nullable=False)
    operating_cash_flow = Column(DECIMAL(20, 2), nullable=True)
    investing_cash_flow = Column(DECIMAL(20, 2), nullable=True)
    financing_cash_flow = Column(DECIMAL(20, 2), nullable=True)
    net_cash_flow = Column(DECIMAL(20, 2), nullable=True)
    capital_expenditures = Column(DECIMAL(20, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    stock = relationship("Stock", back_populates="cash_flows")

    def __repr__(self):
        return f"<CashFlow(stock={self.stock_symbol}, quarter={self.quarter})>"


# 5. Dividends
class Dividend(Base):
    __tablename__ = 'dividends'

    id = Column(Integer, primary_key=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    payment_date = Column(Date, nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    stock = relationship("Stock", back_populates="dividends")

    def __repr__(self):
        return f"<Dividend(stock={self.stock_symbol}, payment_date={self.payment_date})>"


class StockPrice(Base):
    __tablename__ = 'stock_prices'

    price_id = Column(Integer, primary_key=True)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    date = Column(Date, nullable=False)
    open_price = Column(DECIMAL(10, 2))
    close_price = Column(DECIMAL(10, 2))
    high_price = Column(DECIMAL(10, 2))
    low_price = Column(DECIMAL(10, 2))
    volume = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    stock = relationship("Stock", back_populates="prices")

    def __repr__(self):
        return f"<StockPrice(stock={self.stock_symbol}, date={self.date})>"


class Portfolio(Base):
    __tablename__ = 'portfolios'

    portfolio_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    holdings = relationship("PortfolioHolding", back_populates="portfolio")

    def __repr__(self):
        return f"<Portfolio(id={self.portfolio_id}, user_id={self.user_id})>"


class PortfolioHolding(Base):
    __tablename__ = 'portfolio_holdings'

    holding_id = Column(Integer, primary_key=True)
    portfolio_id = Column(Integer, ForeignKey('portfolios.portfolio_id', ondelete='CASCADE'), nullable=False)
    stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
    quantity = Column(Integer, default=0)
    average_price = Column(DECIMAL(10, 2))
    added_at = Column(DateTime, default=datetime.utcnow)

    portfolio = relationship("Portfolio", back_populates="holdings")
    stock = relationship("Stock")

    def __repr__(self):
        return f"<PortfolioHolding(id={self.holding_id}, portfolio_id={self.portfolio_id}, stock={self.stock_symbol})>"