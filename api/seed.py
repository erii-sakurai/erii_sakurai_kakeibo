from datetime import date

from database import Base, SessionLocal, engine
from models import Transaction


def seed_database():
    # テーブルが存在しない場合は作成（Alembic で作成済みですが念のため）
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 既存データがあれば重複投入を防止
        existing_count = db.query(Transaction).count()
        if existing_count > 0:
            print(f'すでに {existing_count} 件のデータが存在するためスキップします。')
            return

        # 4-3 で使っていた初期取引データ
        initial_transactions = [
            Transaction(
                category='食費',
                amount=1200,
                date=date(2026, 8, 20),
                type='expense',
                description='スーパーで買い物',
            ),
            Transaction(
                category='給与',
                amount=250000,
                date=date(2026, 8, 25),
                type='income',
                description='8月分給料',
            ),
            Transaction(
                category='光熱費',
                amount=8500,
                date=date(2026, 8, 28),
                type='expense',
                description='電気代',
            ),
        ]

        db.add_all(initial_transactions)
        db.commit()
        print('✅ 家計簿データのシーディング完了')
    finally:
        db.close()


if __name__ == '__main__':
    seed_database()
