from datetime import date as date_type
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, HTTPException, Path, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Transaction

app = FastAPI(
    title='家計簿 API',
    description='FastAPI + SQLAlchemy + PostgreSQL による家計簿 API',
    version='2.0.0',
)

# CORS の設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

TransactionKind = Literal['income', 'expense']


# --- Pydantic スキーマ定義 ---
class TransactionBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=50, description='カテゴリ')
    amount: int = Field(..., gt=0, description='金額（1円以上）')
    date: date_type = Field(..., description='取引日')
    type: TransactionKind = Field(..., description='収支区分')
    description: str | None = Field(None, max_length=200, description='備考')


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category: str | None = Field(None, min_length=1, max_length=50)
    amount: int | None = Field(None, gt=0)
    date: date_type | None = None
    type: TransactionKind | None = None
    description: str | None = Field(None, max_length=200)


class TransactionResponse(TransactionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class SummaryResponse(BaseModel):
    total_income: int
    total_expense: int
    balance: int


# --- API エンドポイント ---
@app.get(
    '/api/transactions',
    response_model=list[TransactionResponse],
    summary='取引一覧を取得',
)
def get_transactions(
    category: Annotated[str | None, Query(description='カテゴリで絞り込み')] = None,
    transaction_type: Annotated[
        TransactionKind | None,
        Query(alias='type', description='収支区分で絞り込み'),
    ] = None,
    db: Session = Depends(get_db),
) -> list[Transaction]:
    query = db.query(Transaction)
    if category:
        query = query.filter(Transaction.category == category)
    if transaction_type:
        query = query.filter(Transaction.type == transaction_type)
    return query.order_by(Transaction.date.desc()).all()


@app.get(
    '/api/transactions/summary',
    response_model=SummaryResponse,
    summary='収支サマリーを取得',
)
def get_summary(db: Session = Depends(get_db)) -> dict[str, int]:
    transactions = db.query(Transaction).all()
    income = sum(t.amount for t in transactions if t.type == 'income')
    expense = sum(t.amount for t in transactions if t.type == 'expense')
    return {
        'total_income': income,
        'total_expense': expense,
        'balance': income - expense,
    }


@app.get(
    '/api/transactions/{id}',
    response_model=TransactionResponse,
    summary='取引詳細を取得',
)
def get_transaction(
    id: Annotated[int, Path(ge=1, description='取引ID')],
    db: Session = Depends(get_db),
) -> Transaction:
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'ID {id} の取引は見つかりませんでした',
        )
    return transaction


@app.post(
    '/api/transactions',
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary='取引を作成',
)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
) -> Transaction:
    new_transaction = Transaction(**transaction_in.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@app.put(
    '/api/transactions/{id}',
    response_model=TransactionResponse,
    summary='取引を更新',
)
def update_transaction(
    id: Annotated[int, Path(ge=1, description='取引ID')],
    transaction_in: TransactionUpdate,
    db: Session = Depends(get_db),
) -> Transaction:
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'ID {id} の取引は見つかりませんでした',
        )

    update_data = transaction_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@app.delete(
    '/api/transactions/{id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='取引を削除',
)
def delete_transaction(
    id: Annotated[int, Path(ge=1, description='取引ID')],
    db: Session = Depends(get_db),
) -> None:
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'ID {id} の取引は見つかりませんでした',
        )
    db.delete(transaction)
    db.commit()
    return None
