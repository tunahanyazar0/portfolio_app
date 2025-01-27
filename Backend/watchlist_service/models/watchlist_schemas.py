from pydantic import BaseModel, condecimal
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class WatchlistCreate(BaseModel):
    user_id: int
    name: str


class WatchlistResponse(BaseModel):
    watchlist_id: int
    user_id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


# when creating, we do not add alert price. Bunu frontend de alert price update ile yapıcaz
class WatchlistItemCreate(BaseModel): 
    stock_symbol: str
    # watch list id alınmıyor çünkü bu path de var, o yüzden bir daha alınmasına gerek yok

class WatchlistItemResponse(BaseModel):
    item_id: int
    watchlist_id: int
    stock_symbol: str
    alert_price: Optional[Decimal] = None
    added_at: datetime

    class Config:
        from_attributes = True


class AlertPriceUpdate(BaseModel):
    alert_price: Decimal
