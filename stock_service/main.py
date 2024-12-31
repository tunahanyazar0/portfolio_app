# Standard library imports
import uvicorn

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local application imports
from stock_service.controllers.stock_controller import router as stock_router
from stock_service.models import Base
from stock_service.db_context import engine

# Single dot (.) means current directory, double dot (..) means parent directory


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Stock Portfolio Service",
    description="API for managing stock portfolios and market data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Stock Portfolio Service API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
