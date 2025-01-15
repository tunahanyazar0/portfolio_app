from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, DECIMAL, FLOAT, Enum
from datetime import datetime
from utils.db_utils import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(Enum('admin', 'user', 'moderator', name='user_roles'), nullable=False, default='user') # role of the user
