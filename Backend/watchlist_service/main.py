# Standard library imports
import uvicorn

# Third-party imports
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# Local application imports
from controllers.watchlist_controller import router as stock_router
from models.models import Base
from utils.db_context import engine
from utils.websocket_manager import websocket_manager

# Single dot (.) means current directory, double dot (..) means parent directory


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Watchlist Service API",
    description="Service for managing watchlists and watchlist items",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the Watchlist Service API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }


# http request i : http://localhost:8002/api/watchlists/1/items : http route 
# web socket requesti: ws://localhost:8002/ws/  : web socket route
# url is structured differently for websocket endpoints

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket_manager.connect(websocket, user_id)  # Accept connection and add to manager
    try:
        while True:
            data = await websocket.receive_text()  # Wait for message from the client
            print(f"Received data from user {user_id}: {data}")
            await websocket.send_text(f"Message received: {data}")  # Send a response back to the client
    except WebSocketDisconnect:
        await websocket_manager.disconnect(user_id)  # Ensure disconnection is handled
        print(f"User {user_id} disconnected.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
