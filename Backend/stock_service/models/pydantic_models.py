from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal

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

# bu stock price oluştururken ve ayrıca stock price isterken bir date range de 
class StockPriceInput(BaseModel):
    stock_symbol: str
    start_date: date
    end_date: date


# bu ikisi stock price input ve output için
class StockPriceRequest(BaseModel):
    stock_symbol: str
    date: str

class StockPriceInRangeRequest(BaseModel):
    stock_symbol: str
    start_date: str
    end_date: str

class StockPriceResponse(BaseModel):
    stock_symbol: str
    date: str
    close_price: Optional[Decimal]

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

