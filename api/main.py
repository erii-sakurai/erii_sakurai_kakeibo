from __future__ import annotations

from typing import Literal

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(
    title='家計簿 API',
    description='Section 4-3 家計簿用 RESTful API',
    version='1.0.0',
)


# --- スキーマ定義 ---
class TransactionBase(BaseModel):
    category: str = Field(..., min_length=1, max_length=50, description='カテゴリ名')
    amount: int = Field(..., gt=0, description='金額（正の整数）')
    date: str = Field(..., description='取引日 (YYYY-MM-DD)')
    type: Literal['income', 'expense'] = Field(
        ..., description='収支区分: income / expense'
    )
    description: str | None = Field(
        default=None, max_length=200, description='メモ・摘要'
    )


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category: str | None = Field(default=None, min_length=1, max_length=50)
    amount: int | None = Field(default=None, gt=0)
    date: str | None = None
    type: Literal['income', 'expense'] | None = None
    description: str | None = Field(default=None, max_length=200)


class TransactionResponse(TransactionBase):
    id: int


class SummaryResponse(BaseModel):
    total_income: int
    total_expense: int
    balance: int


# --- ダミーデータ ---
mock_db: list[dict[str, object]] = [
    {
        'id': 1,
        'category': '食費',
        'amount': 1200,
        'date': '2026-09-01',
        'type': 'expense',
        'description': 'ランチ',
    },
    {
        'id': 2,
        'category': '給与',
        'amount': 250000,
        'date': '2026-09-10',
        'type': 'income',
        'description': '9月分給与',
    },
    {
        'id': 3,
        'category': '光熱費',
        'amount': 8500,
        'date': '2026-09-12',
        'type': 'expense',
        'description': '電気代',
    },
]
current_id: int = 3


# --- エンドポイント ---
@app.get(
    '/api/transactions',
    response_model=list[TransactionResponse],
    summary='取引一覧を取得',
)
def get_transactions() -> list[dict[str, object]]:
    return mock_db


@app.get(
    '/api/transactions/summary',
    response_model=SummaryResponse,
    summary='収支サマリーを取得',
)
def get_summary() -> dict[str, int]:
    income = sum(
        val
        for t in mock_db
        if t.get('type') == 'income' and isinstance(val := t.get('amount'), int)
    )
    expense = sum(
        val
        for t in mock_db
        if t.get('type') == 'expense' and isinstance(val := t.get('amount'), int)
    )
    return {
        'total_income': income,
        'total_expense': expense,
        'balance': income - expense,
    }


@app.get(
    '/api/transactions/{transaction_id}',
    response_model=TransactionResponse,
    summary='特定の取引を取得',
)
def get_transaction(transaction_id: int) -> dict[str, object]:
    for item in mock_db:
        if item['id'] == transaction_id:
            return item
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'ID {transaction_id} の取引は見つかりませんでした',
    )


@app.post(
    '/api/transactions',
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary='新しい取引を作成',
)
def create_transaction(data: TransactionCreate) -> dict[str, object]:
    global current_id
    current_id += 1
    new_item = {
        'id': current_id,
        'category': data.category,
        'amount': data.amount,
        'date': data.date,
        'type': data.type,
        'description': data.description,
    }
    mock_db.append(new_item)
    return new_item


@app.put(
    '/api/transactions/{transaction_id}',
    response_model=TransactionResponse,
    summary='取引を更新',
)
def update_transaction(
    transaction_id: int, data: TransactionUpdate
) -> dict[str, object]:
    for item in mock_db:
        if item['id'] == transaction_id:
            update_data = data.model_dump(exclude_unset=True)
            for key, val in update_data.items():
                item[key] = val
            return item
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'ID {transaction_id} の取引は見つかりませんでした',
    )


@app.delete(
    '/api/transactions/{transaction_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='取引を削除',
)
def delete_transaction(transaction_id: int) -> None:
    global mock_db
    for i, item in enumerate(mock_db):
        if item['id'] == transaction_id:
            mock_db.pop(i)
            return None
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'ID {transaction_id} の取引は見つかりませんでした',
    )
