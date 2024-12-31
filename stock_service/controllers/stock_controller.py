from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date
from typing import List

from ..db_context import get_db
from ..services.stock_service import StockService
from ..models import Stock, StockPrice, Portfolio, PortfolioHolding

router = APIRouter(
    prefix="/api/stocks",
    tags=["stocks"]
)

@router.post("/", response_model=Stock)
def create_stock(symbol: str, name: str, sector: str, market_cap: float, db: Session = Depends(get_db)):
    service = StockService(db)
    existing_stock = service.get_stock(symbol)
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock already exists")
    return service.create_stock(symbol, name, sector, Decimal(str(market_cap)))

@router.get("/{symbol}", response_model=Stock)
def get_stock(symbol: str, db: Session = Depends(get_db)):
    service = StockService(db)
    stock = service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.get("/", response_model=List[Stock])
def get_all_stocks(db: Session = Depends(get_db)):
    service = StockService(db)
    return service.get_all_stocks()

@router.post("/{symbol}/prices")
def add_stock_price(
    symbol: str,
    price_date: date,
    open_price: float,
    close_price: float,
    high_price: float,
    low_price: float,
    volume: int,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    stock = service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return service.add_stock_price(
        symbol,
        price_date,
        Decimal(str(open_price)),
        Decimal(str(close_price)),
        Decimal(str(high_price)),
        Decimal(str(low_price)),
        volume
    )

@router.post("/portfolios", response_model=Portfolio)
def create_portfolio(user_id: int, name: str, db: Session = Depends(get_db)):
    service = StockService(db)
    return service.create_portfolio(user_id, name)

@router.get("/portfolios/{portfolio_id}", response_model=Portfolio)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    portfolio = service.get_portfolio(portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.get("/portfolios/user/{user_id}", response_model=List[Portfolio])
def get_user_portfolios(user_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    return service.get_user_portfolios(user_id)

@router.post("/portfolios/{portfolio_id}/holdings")
def add_holding(
    portfolio_id: int,
    symbol: str,
    quantity: int,
    price: float,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    portfolio = service.get_portfolio(portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    stock = service.get_stock(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return service.add_holding(portfolio_id, symbol, quantity, Decimal(str(price)))

@router.put("/portfolios/holdings/{holding_id}")
def update_holding(
    holding_id: int,
    quantity: int,
    price: float,
    db: Session = Depends(get_db)
):
    service = StockService(db)
    holding = service.update_holding(holding_id, quantity, Decimal(str(price)))
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    return holding

@router.delete("/portfolios/holdings/{holding_id}")
def delete_holding(holding_id: int, db: Session = Depends(get_db)):
    service = StockService(db)
    if not service.delete_holding(holding_id):
        raise HTTPException(status_code=404, detail="Holding not found")
    return {"message": "Holding deleted successfully"}
