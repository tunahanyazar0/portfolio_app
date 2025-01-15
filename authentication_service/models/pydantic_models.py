from typing import Optional
from datetime import timedelta
from pydantic import BaseModel, EmailStr

# Pydantic models for request/response
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    role: str

    class Config:
        orm_mode = True