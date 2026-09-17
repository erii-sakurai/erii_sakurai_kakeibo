from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.sql import func

from database import Base


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)
    amount = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    type = Column(String(20), nullable=False)  # 'income' または 'expense'
    description = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
