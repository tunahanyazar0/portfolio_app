from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional

class StockCreate(BaseModel):
    symbol: str
    name: str 
    sector: str
    market_cap: float

class StockResponse(BaseModel):
    stock_symbol: str
    name: str
    sector_id: int
    market_cap: float
    last_updated: Optional[datetime]

    class Config:
        from_attributes = True

class StockPriceCreate(BaseModel):
    price_date: date
    open_price: float
    close_price: float
    high_price: float
    low_price: float
    volume: int

class StockPriceResponse(BaseModel):
    price_id: int
    stock_symbol: str
    date: date
    close_price: float
    created_at: datetime

    class Config:
        from_attributes = True

class PortfolioCreate(BaseModel):
    user_id: int
    name: str

class PortfolioResponse(BaseModel):
    portfolio_id: int
    user_id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class HoldingCreate(BaseModel):
    symbol: str
    quantity: int
    price: float

class HoldingResponse(BaseModel):
    holding_id: int
    portfolio_id: int
    stock_symbol: str
    quantity: int
    average_price: float
    added_at: datetime

    class Config:
        from_attributes = True

class HoldingUpdate(BaseModel):
    quantity: int
    price: float