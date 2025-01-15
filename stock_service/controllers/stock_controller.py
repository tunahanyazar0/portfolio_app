from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date
from typing import List, Optional
from utils.db_context import get_db
from services.stock_service import StockService
from models.models import Stock, StockPrice, Portfolio, PortfolioHolding
from models.pydantic_models import *


router = APIRouter(
    prefix="/api/stocks",
    tags=["stocks"]
)

@router.post("/", response_model=StockResponse)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    service = StockService(db)
    existing_stock = service.get_stock(stock.symbol)
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock already exists")
    return service.create_stock(stock.symbol, stock.name, stock.sector, Decimal(str(stock.market_cap)))

@router.get("/{symbol}", response_model=StockResponse)
def get_stock(symbol: str, db: Session = Depends(get_db)):
    service = StockService(db)
    stock = service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.get("/", response_model=List[StockResponse])
def get_all_stocks(db: Session = Depends(get_db)):
    service = StockService(db)
    return service.get_all_stocks()

@router.post("/{symbol}/prices", response_model=StockPriceResponse)
def add_stock_price(
    symbol: str,
    price: StockPriceCreate,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    stock = service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return service.add_stock_price(
        symbol,
        price.price_date,
        Decimal(str(price.open_price)),
        Decimal(str(price.close_price)),
        Decimal(str(price.high_price)),
        Decimal(str(price.low_price)),
        price.volume
    )

@router.post("/portfolios", response_model=PortfolioResponse)
def create_portfolio(portfolio: PortfolioCreate, db: Session = Depends(get_db)):
    service = StockService(db)
    return service.create_portfolio(portfolio.user_id, portfolio.name)

@router.get("/portfolios/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    portfolio = service.get_portfolio(portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.get("/portfolios/user/{user_id}", response_model=List[PortfolioResponse])
def get_user_portfolios(user_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    return service.get_user_portfolios(user_id)

@router.post("/portfolios/{portfolio_id}/holdings", response_model=HoldingResponse)
def add_holding(
    portfolio_id: int,
    holding: HoldingCreate,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    portfolio = service.get_portfolio(portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    stock = service.get_stock(holding.symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return service.add_holding(portfolio_id, holding.symbol, holding.quantity, Decimal(str(holding.price)))

@router.put("/portfolios/holdings/{holding_id}", response_model=HoldingResponse)
def update_holding(
    holding_id: int,
    holding: HoldingUpdate,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    holding_obj = service.update_holding(holding_id, holding.quantity, Decimal(str(holding.price)))
    if not holding_obj:
        raise HTTPException(status_code=404, detail="Holding not found")
    return holding_obj

@router.delete("/portfolios/holdings/{holding_id}")
def delete_holding(holding_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    if not service.delete_holding(holding_id):
        raise HTTPException(status_code=404, detail="Holding not found")
    return {"message": "Holding deleted successfully"}
