from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, date
from models.models import Watchlist, WatchlistItem, Stock, User
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal
import yfinance as yf
from utils.websocket_manager import websocket_manager


# in the watchlist service we do not return detailed info of the stocks in the watchlist
# just the stock symbol and the current price : using get_current_stock_price method in the stock controller
# current fiyata bakarak frontend de alert ler uygulayabiliriz mesela hissenin fiyatı x olursa alert the user gibi 
class WatchlistService:

    def __init__(self, db: Session):
        self.db = db

    """
        class Watchlist(Base):
        __tablename__ = "watchlists"
        
        watchlist_id = Column(Integer, primary_key=True, autoincrement=True)
        user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
        name = Column(String(255), nullable=False)
        created_at = Column(DateTime, default=datetime.utcnow) 
        
        # Relationship to User
        user = relationship("User", back_populates="watchlists")
        
        # Relationship to WatchlistItem
        items = relationship("WatchlistItem", back_populates="watchlist", cascade="all, delete-orphan")

    class WatchlistItem(Base):
        __tablename__ = "watchlist_items"
        
        item_id = Column(Integer, primary_key=True, autoincrement=True)
        watchlist_id = Column(Integer, ForeignKey('watchlists.watchlist_id'), nullable=False)
        stock_symbol = Column(String(10), ForeignKey('stocks.stock_symbol'), nullable=False)
        alert_price = Column(DECIMAL(10, 2), nullable=True)  
        added_at = Column(DateTime, default=datetime.utcnow)
        
        # Relationship to Watchlist
        watchlist = relationship("Watchlist", back_populates="items")
        
        # Relationship to Stock
        stock = relationship("Stock")
    
    """


    # SERVICES RELATED TO WATCHLIST
    def create_watchlist(self, user_id: int, name: str) -> Watchlist:
        watchlist = Watchlist(
            user_id=user_id,
            name=name
        )
        self.db.add(watchlist)
        self.db.commit()
        self.db.refresh(watchlist)
        return watchlist
    
    def add_to_watchlist(self, watchlist_id: int, symbol: str) -> WatchlistItem:
        symbol = symbol.upper() # we store the stock symbols in uppercase

        # check if the stock exists
        stock = self.db.query(Stock).filter(Stock.stock_symbol == symbol).first()
        if not stock:
            raise ValueError(f"Stock with symbol {symbol} does not exists")

        # check if the watchlist exists
        watchlist = self.db.query(Watchlist).filter(Watchlist.watchlist_id == watchlist_id).first()
        if not watchlist:
            raise ValueError(f"Watchlist with id {watchlist_id} does not exists")

        # check if the stock is already in the watchlist
        item = self.db.query(WatchlistItem).filter(
            WatchlistItem.watchlist_id == watchlist_id,
            WatchlistItem.stock_symbol == symbol
        ).first()

        # price alert is not set by default, it can be set. We will do it in the frontend not when we add an item to the watchlist

        if item:
            raise ValueError(f"Stock with symbol {symbol} is already in the watchlist")

        # otherwise add the stock to the watchlist
        item = WatchlistItem(
            watchlist_id=watchlist_id,
            stock_symbol=symbol
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
    
    # it returns the watchlist object with the name and id but not the items in it
    def get_watchlist(self, watchlist_id: int) -> Optional[Watchlist]:
        response = self.db.query(Watchlist).filter(Watchlist.watchlist_id == watchlist_id).first()
        return response
        # if no watchlist with the given id is found, it will return None

    # get all watchlists of the user 
    def get_watchlists_of_user(self, user_id: int) -> List[Watchlist]:
        # check if the user exists
        user = self.db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise ValueError(f"User with id {user_id} does not exists")
        
        return self.db.query(Watchlist).filter(Watchlist.user_id == user_id).all()

    def get_watchlist_items(self, watchlist_id: int) -> List[WatchlistItem]:
        # check if the watchlist exists
        watchlist = self.db.query(Watchlist).filter(Watchlist.watchlist_id == watchlist_id).first()
        if watchlist is None:
            raise ValueError(f"Watchlist with id {watchlist_id} does not exists")

        return self.db.query(WatchlistItem).filter(WatchlistItem.watchlist_id == watchlist_id).all()
    
    # to delete a stock from a watchlist
    def delete_watchlist_item(self, item_id: int) -> bool:
        item = self.db.query(WatchlistItem).filter(WatchlistItem.item_id == item_id).first()
        if not item:
            raise ValueError(f"Watchlist item with id {item_id} does not exists")
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False
    
    # to delete a watchlist
    def delete_watchlist(self, watchlist_id: int) -> bool:
        watchlist = self.db.query(Watchlist).filter(Watchlist.watchlist_id == watchlist_id).first()
        if not watchlist:
            raise ValueError(f"Watchlist with id {watchlist_id} does not exists")
        if watchlist:
            self.db.delete(watchlist)
            self.db.commit()
            return True
        return False
    

    def set_alert_price(self, item_id: int, alert_price: Decimal) -> WatchlistItem:
        """
        Set or update the alert price for a stock in the watchlist.
        """
        item = self.db.query(WatchlistItem).filter(WatchlistItem.item_id == item_id).first()
        if not item:
            raise ValueError(f"Watchlist item with id {item_id} does not exist")

        item.alert_price = alert_price
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_alert_price(self, item_id: int) -> WatchlistItem:
        """
        Remove the alert price for a stock in the watchlist.
        """
        item = self.db.query(WatchlistItem).filter(WatchlistItem.item_id == item_id).first()
        if not item:
            raise ValueError(f"Watchlist item with id {item_id} does not exist")

        item.alert_price = None
        self.db.commit()
        self.db.refresh(item)
        return item
    
    # to learn the price of the stock in the watchlist
    def get_current_stock_price(self, stock_symbol: str) -> Decimal:
        """
            Using the yahoo finance api, get the current stock price for the given stock symbol
        """
        try:
            stock_symbol = stock_symbol.upper()
            # add .IS to the end of the stock symbol since yahoo finance excepts that
            stock_symbol += ".IS"
            stock = yf.Ticker(stock_symbol)
            info = stock.info
            current_price = info.get("currentPrice", None)
            print(f"Current price of {stock_symbol}: {current_price}")
            # we need to return the price as decimal.Decimal
            return Decimal(current_price) if current_price is not None else None
        except Exception as e:
            print(f"An error occurred while fetching stock price: {e}")
    
    """
        - background task that periodically checks stock prices and notifies the user when the price is within 1% of their target alert price
        - Use WebSockets to notify the user.
    """

    def check_price_alerts(self) -> list[dict]:
        """
        Checks if any watchlist stocks are within 1% of their target price.
        Returns a list of notifications.
        """
        watchlist_items = self.db.query(WatchlistItem).filter(WatchlistItem.alert_price.isnot(None)).all()
        notifications = []

        for item in watchlist_items:
            current_price = self.get_current_stock_price(item.stock_symbol)
            # take the 2 decimal 
            current_price = "{:.2f}".format(current_price) if current_price is not None else None
            current_price = Decimal(current_price)
            
            if current_price is None:
                continue  # Skip if price is not available

            print(f"Checking price alert for {item.stock_symbol}. Current price: {current_price}, Target price: {item.alert_price}")
            
            target_price = item.alert_price
            if abs(current_price - target_price) / target_price <= 0.01:
                watchlist = self.db.query(Watchlist).filter(Watchlist.watchlist_id == item.watchlist_id).first()
                user_id = watchlist.user_id if watchlist else None
                
                if user_id:
                    notifications.append({
                        "user_id": user_id,
                        "stock_symbol": item.stock_symbol,
                        "target_price": target_price,
                        "current_price": current_price
                    })
        
        return notifications