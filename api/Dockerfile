FROM python:3.12-slim

WORKDIR /app

# パッケージ管理ツールのインストール
RUN pip install --no-cache-dir uv

COPY pyproject.toml .env* ./
RUN uv pip install --system --no-cache sqlalchemy psycopg2-binary alembic pydantic-settings fastapi "uvicorn[standard]" python-dotenv

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]