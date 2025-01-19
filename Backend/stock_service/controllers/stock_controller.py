from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date
from typing import List, Optional
from utils.db_context import get_db
from services.stock_service import StockService
from models.models import Stock, StockPrice, Portfolio, PortfolioHolding
from models.pydantic_models import *
from utils.authentication_utils import verify_role # this function checks the token and returns the username if the token is legit

router = APIRouter(
    prefix="/api/stocks",
    tags=["stocks"]
)

# only admin or moderator can add stock to the system
@router.post("/", response_model=StockResponse)
async def create_stock(stock: StockCreate, db: Session = Depends(get_db), username: str = Depends(verify_role)):
    service = StockService(db)
    existing_stock = service.get_stock(stock.symbol)
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock already exists")
    return service.create_stock(stock.symbol, stock.name, stock.sector, Decimal(str(stock.market_cap)))


# ENDPOINT FOR STOCK PRICES SERVICES
@router.post("/{symbol}/add-price")
async def add_stock_prices(stock_price_input: StockPriceInput, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    stock_service.add_stock_price(stock_price_input.stock_symbol, stock_price_input.start_date.isoformat(), stock_price_input.end_date.isoformat())
    return {"message": f"Stock prices for {stock_price_input.stock_symbol} added from {stock_price_input.start_date} to {stock_price_input.end_date}."}

"""
example request: http://localhost:8001/api/stocks/price
{
    "stock_symbol": "AAPL",
    "date": "2021-01-04"
}

example response:
{   
    "stock_symbol": "AAPL",
    "date": "2021-01-04",
    "close_price": 129.41
}
"""
"""
@router.post("/price", response_model=StockPriceResponse)
def get_stock_price(request: StockPriceRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    price = stock_service.get_stock_price_on_date(request.stock_symbol, request.date)
    
    # if price is none, do not raise error since it might be a weekend or a holiday
    if price is None:
        return StockPriceResponse(
            stock_symbol=request.stock_symbol,
            date=request.date,
            close_price=None
        )
    
    return StockPriceResponse(
        stock_symbol=request.stock_symbol,
        date=request.date,
        close_price=price
    )
"""

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


# ANLIK KULLANILAN ENDPOINTLER
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

# To get general info about a stock using yahoo finance
"""
example input: http://localhost:8001/api/stocks/AAPL/info
example output:
{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Technology",
    "market_cap": 2.2e12
    ...
}
"""
@router.get("/{symbol}/info")
def get_stock_info(symbol: str, db: Session = Depends(get_db)):
    service = StockService(db)
    stock_info = service.get_stock_info(symbol)
    if not stock_info:
        raise HTTPException(status_code=404, detail="Stock info not found")
    return stock_info


# To get the recent stock price of a stock
"""
example input: http://localhost:8001/api/stocks/AAPL/price
example output:
{   
    "stock_symbol": "AAPL",
    "date": "2021-01-04",
    "close_price": 129.41
}
"""
@router.get("/{symbol}/price", response_model=StockPriceResponse)
def get_current_stock_price(symbol: str, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    price = stock_service.get_current_stock_price(symbol)
    if price is None:
        raise HTTPException(status_code=404, detail="Stock price not found")
    return StockPriceResponse(
        stock_symbol=symbol.upper(),
        date=date.today().isoformat(),
        close_price=price
    )


# To get the stock prices for a given stock symbol and date range
"""
example input: 
{
    "stock_symbol": "AAPL",
    "start_date": "2021-01-01",
    "end_date": "2021-01-03"
}

example output:
[
    {
        "stock_symbol": "AAPL",
        "date": "2021-01-01",
        "close_price": 129.41
    },
    {
        "stock_symbol": "AAPL",
        "date": "2021-01-02",
        "close_price": 131.01
    }
]
"""
@router.post("/prices-range", response_model=List[StockPriceResponse])
def get_stock_prices(request: StockPriceInRangeRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    prices = stock_service.get_stock_price_in_range(request.stock_symbol, request.start_date, request.end_date)
    
    # Convert date to string
    response = [
        StockPriceResponse(
            stock_symbol=price.stock_symbol,
            date=price.date.isoformat(),  # Convert date to string
            close_price=price.close_price
        )
        for price in prices
    ]
    
    return response

# Retrieve the income statement data for a given stock symbol
# Endpoint to return all financial data for a given stock symbol
@router.get("/financials/{symbol}", response_model=List[IncomeStatementResponse])
def get_financial_data(symbol: str, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    financials = stock_service.get_financial_data(symbol)
    if not financials:
        raise HTTPException(status_code=404, detail="Financial data not found")
    
    # Convert quarter to string
    response = [
        IncomeStatementResponse(
            id=financial.id,
            stock_symbol=financial.stock_symbol,
            quarter=financial.quarter.isoformat(),  # Convert date to string
            revenue=financial.revenue,
            gross_profit=financial.gross_profit,  # Added gross profit
            operating_income=financial.operating_income,  # Added operating income
            net_profit=financial.net_profit,
            eps=financial.eps,
            operating_margin=financial.operating_margin  # Added operating margin (%)
        )
        for financial in financials
    ]
    
    return response

# Endpoint to return all balance sheet data for a given stock symbol
@router.get("/balance-sheet/{symbol}", response_model=List[BalanceSheetResponse])
def get_balance_sheet_data(symbol: str, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    balance_sheets = stock_service.get_balance_sheet_data(symbol)
    if not balance_sheets:
        raise HTTPException(status_code=404, detail="Balance sheet data not found")
    
    # Convert quarter to string
    response = [
        BalanceSheetResponse(
            id=balance_sheet.id,
            stock_symbol=balance_sheet.stock_symbol,
            quarter=balance_sheet.quarter.isoformat(),  # Convert date to string
            total_assets=balance_sheet.total_assets,
            total_liabilities=balance_sheet.total_liabilities,  # Added total liabilities
            total_equity=balance_sheet.total_equity,  # Added total equity
            current_assets=balance_sheet.current_assets,  # Added current assets
            current_liabilities=balance_sheet.current_liabilities  # Added current liabilities
        )
        for balance_sheet in balance_sheets
    ]
    
    return response

# Endpoint to return all cash flow data for a given stock symbol
@router.get("/cash-flow/{symbol}", response_model=List[CashFlowResponse])
def get_cash_flow_data(symbol: str, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    cash_flows = stock_service.get_cash_flow_data(symbol)
    if not cash_flows:
        raise HTTPException(status_code=404, detail="Cash flow data not found")
    
    # Convert quarter to string
    response = [
        CashFlowResponse(
            id=cash_flow.id,
            stock_symbol=cash_flow.stock_symbol,
            quarter=cash_flow.quarter.isoformat(),  # Convert date to string
            operating_cash_flow=cash_flow.operating_cash_flow,
            investing_cash_flow=cash_flow.investing_cash_flow,  # Added investing cash flow
            financing_cash_flow=cash_flow.financing_cash_flow,  # Added financing cash flow
            free_cash_flow=cash_flow.free_cash_flow,  # Added free cash flow
            capital_expenditures=cash_flow.capital_expenditures  # Added capital expenditures
        )
        for cash_flow in cash_flows
    ]
    
    return response


# ENDPOINT FOR ADDING DATA TO DB
@router.post("/add-income-statement")
def add_income_statement_to_db(request: IncomeStatementRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    print("request.stock_symbol", request.stock_symbol)
    stock_service.add_income_statement(request.stock_symbol)
    
    # return a success message
    return {"message": "Income statement added successfully"}

# ENDPOINT FOR ADDING BALANCE SHEET DATA TO DB
@router.post("/add-balance-sheet")
def add_balance_sheet_to_db(request: BalanceSheetRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    stock_service.add_balance_sheet(request.stock_symbol)
    
    # return a success message
    return {"message": "Balance sheet added successfully"}

# ENDPOINT FOR ADDING CASH FLOW DATA TO DB
@router.post("/add-cash-flow")
def add_cash_flow_to_db(request: CashFlowRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    stock_service.add_cash_flow(request.stock_symbol)
    
    # return a success message
    return {"message": "Cash flow added successfully"}


# ENDPOINT FOR ADDING DIVIDEND DATA TO DB
@router.post("/add-dividend")
def add_dividend_to_db(request: DividendRequest, db: Session = Depends(get_db)):
    stock_service = StockService(db)
    stock_service.add_dividend(request.stock_symbol)
    
    # return a success message
    return {"message": "Dividend added successfully"}


# ENDPOINT FOR SEARCHING STOCKS
@router.get("/search/{query}", response_model=List[StockResponse])
def search_stocks(query, db: Session = Depends(get_db)):
    service = StockService(db)
    stocks = service.search_stocks(query)
    if not stocks:
        raise HTTPException(status_code=404, detail="No stocks found")
    return stocks