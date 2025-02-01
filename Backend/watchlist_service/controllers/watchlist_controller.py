from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal
from utils.db_context import get_db
from services.watchlist_service import WatchlistService
from models.watchlist_schemas import (
    WatchlistCreate,
    WatchlistResponse,
    WatchlistItemResponse,
    WatchlistItemCreate,
    AlertPriceUpdate
)
# to inform the user about the changes in the watchlist
from utils.websocket_manager import websocket_manager

router = APIRouter(
    prefix="/api/watchlists",
    tags=["watchlists"]
)


# create a watchlist
"""
example url: /watchlists/create
example request:
{
    "user_id": 1,
    "name": "Bilancosu İyi Beklenenler"
}

example response:
{
    "watchlist_id": 1,
    "user_id": 1,
    "name": "Bilancosu İyi Beklenenler",
    "created_at": "2025-01-27T10:23:30"
}
"""
@router.post("/create", response_model=WatchlistResponse)
def create_watchlist(watchlist_data: WatchlistCreate, db: Session = Depends(get_db)):
    service = WatchlistService(db)
    watchlist = service.create_watchlist(user_id=watchlist_data.user_id, name=watchlist_data.name)
    return WatchlistResponse.from_orm(watchlist)

# add a stock to a watchlist. If the stock is already in the watchlist, it raise an error. 
"""
example url: /watchlists/add/1/items
example request:
{
    "stock_symbol": "ORGE"
}

example response:
{
    "item_id": 1,
    "watchlist_id": 1,
    "stock_symbol": "ORGE",
    "alert_price": null,
    "added_at": "2025-01-27T10:25:02"
}
"""
@router.post("/add/{watchlist_id}/items", response_model=WatchlistItemResponse)
async def add_to_watchlist(watchlist_id: int, item_data: WatchlistItemCreate, db: Session = Depends(get_db)):
    service = WatchlistService(db)
    try:
        item = service.add_to_watchlist(watchlist_id=watchlist_id, symbol=item_data.stock_symbol)

        # inform the user about the changes in the watchlist
        watchlist = service.get_watchlist(watchlist_id)
        await websocket_manager.send_update(
            watchlist.user_id, f"Stock {item_data.stock_symbol} added to watchlist {watchlist.name}."
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return WatchlistItemResponse.from_orm(item)

# get watchlist but not the items in it
"""
example response:
{
  "watchlist_id": 1,
  "user_id": 1,
  "name": "Bilancosu İyi Beklenenler",
  "created_at": "2025-01-27T10:23:30"
}
"""
@router.get("/{watchlist_id}", response_model=Optional[WatchlistResponse])
def get_watchlist(watchlist_id: int, db: Session = Depends(get_db)):
    service = WatchlistService(db)
    watchlist = service.get_watchlist(watchlist_id)
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return WatchlistResponse.from_orm(watchlist)

# get all watchlists of a user
"""
example response:
[
    {   
        "watchlist_id": 1,
        "user_id": 1,
        "name": "Bilancosu İyi Beklenenler",
        "created_at": "2025-01-27T10:23:30"
    },
    ...
]
"""
@router.get("/user/{user_id}", response_model=List[WatchlistResponse])
def get_watchlists_of_user(user_id: int, db: Session = Depends(get_db)):
    try: 
        service = WatchlistService(db)
        watchlists = service.get_watchlists_of_user(user_id)
        return [WatchlistResponse.from_orm(watchlist) for watchlist in watchlists]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
        

# get items in a watchlist
"""
example response:
[
  {
    "item_id": 1,
    "watchlist_id": 1,
    "stock_symbol": "ORGE",
    "alert_price": null,
    "added_at": "2025-01-27T10:25:02"
  },
  {
    "item_id": 2,
    "watchlist_id": 1,
    "stock_symbol": "THYAO",
    "alert_price": null,
    "added_at": "2025-01-27T10:27:13"
  }
]

"""
@router.get("/{watchlist_id}/items", response_model=List[WatchlistItemResponse])
def get_watchlist_items(watchlist_id: int, db: Session = Depends(get_db)):
    service = WatchlistService(db)
    items = service.get_watchlist_items(watchlist_id)
    return [WatchlistItemResponse.from_orm(item) for item in items]

# delete watchlist itself
"""
example url: /watchlists/delete/1
example response: true
"""
@router.delete("/delete/{watchlist_id}", response_model=bool)
def delete_watchlist(watchlist_id: int, db: Session = Depends(get_db)):
    try:
        service = WatchlistService(db)
        return service.delete_watchlist(watchlist_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # raise 500 coded error since we do not know what the error is
        raise HTTPException(status_code=500, detail=str(e))
    

# delete a stock from a watchlist
"""
example url: /watchlist-items/remove/1
example response: true
"""
@router.delete("/delete-item/{item_id}", response_model=bool)
def delete_watchlist_item(item_id: int, db: Session = Depends(get_db)):
    try:
        service = WatchlistService(db)
        return service.delete_watchlist_item(item_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # raise 500 coded error since we do not know what the error is
        raise HTTPException(status_code=500, detail=str(e))


"""
example url: /watchlist-items/1/alert
example request:
{
    "alert_price": 10.5
}   
example response:
{
    "item_id": 1,
    "watchlist_id": 1,
    "stock_symbol": "ORGE",
    "alert_price": 10.5,
    "added_at": "2025-01-27T10:25:02"
}
"""
@router.put("/{item_id}/alert/create", response_model=WatchlistItemResponse)
def set_alert_price(item_id: int, alert_data: AlertPriceUpdate, db: Session = Depends(get_db)):
    try:
        service = WatchlistService(db)
        # alert_data.alert_price = decimal
        item = service.set_alert_price(item_id, alert_price=Decimal(alert_data.alert_price))
        return WatchlistItemResponse.from_orm(item)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# remove alert price from a stock
"""
example url: /watchlist-items/1/alert
example response:
{
    "item_id": 1,
    "watchlist_id": 1,
    "stock_symbol": "ORGE",
    "alert_price": null,
    "added_at": "2025-01-27T10:25:02"
}
"""
@router.delete("/{item_id}/alert/delete", response_model=WatchlistItemResponse)
def remove_alert_price(item_id: int, db: Session = Depends(get_db)):
    try:
        service = WatchlistService(db)
        item = service.remove_alert_price(item_id)
        return WatchlistItemResponse.from_orm(item)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# check alerts
"""
example url: /check-alerts
example response: {"message": "Checked 0 alerts"}
"""
# this is needed when we want an admin or user-triggered check in addition to the automatic process.
# might be deleted later since it is not necessary
@router.post("/check-alerts")
async def check_alerts(db: Session = Depends(get_db)):
    """
    Manually check price alerts and send WebSocket notifications to users.
    """
    service = WatchlistService(db)
    notifications = service.check_price_alerts()

    for notification in notifications:
        message = (f"🚨 Stock Alert: {notification['stock_symbol']} is near your target price of "
                   f"{notification['target_price']}! Current price: {notification['current_price']}")
        
        user_id = notification["user_id"]

        await websocket_manager.send_update(
            user_id, message
        )

        print("message sent")

    return {"message": f"Checked {len(notifications)} alerts"}
    
