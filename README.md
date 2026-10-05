# 💰 家計簿 Web アプリケーション (with AI Advisor)

Next.js (App Router) と FastAPI、Mastra を組み合わせたフルスタック家計簿 Web アプリケーションです。
日々の収支管理・リアルタイム集計機能に加え、OpenAI と Mastra エージェントを活用した家計改善アドバイス機能を備えています。

---

## 🌟 主な機能

- **収支管理・明細一覧**:
  - 収入・支出の新規登録、編集、削除（CRUD）
  - 今月の総収入・総支出・収支差額のリアルタイム自動集計
- **AI 節約アドバイザー (Section 5-1)**:
  - 支出カテゴリや金額データを Mastra エージェントへ渡し、固定費・変動費の削減ポイントを自動提案
- **マルチエージェント家計・資産形成レポート (Section 5-2)**:
  - **家計診断エージェント (Budget Analyst)**: 収支バランス分析と余剰資金の算出
  - **資産形成エージェント (Market Advisor)**: 余剰資金に応じた積立・分散投資のアプローチ提案
  - **総合レポート作成エージェント (Report Coordinator)**: 上記を統合した月次 Markdown レポートの生成

---

## 🛠 技術スタック

| 分野 | 技術 | 用途 |
| :--- | :--- | :--- |
| **フロントエンド** | Next.js 16 (App Router), TypeScript, Tailwind CSS | UI 設計・コンポーネント開発・状態管理 |
| **バックエンド** | FastAPI, Python 3.12 | REST API 設計、CRUD 処理 |
| **AI / エージェント** | Mastra, OpenAI API (`gpt-4o-mini`) | 節約アドバイスおよびマルチエージェント分析 |
| **データベース** | PostgreSQL, Prisma / SQLAlchemy | 収支データの永続化 |
| **環境構築・ツール** | Docker, Git / GitHub | 開発環境のコンテナ化・バージョン管理 |

---

## 🏗 システム構成

```text
erii_sakurai_kakeibo/
├── client/     # Next.js フロントエンド (ポート 3001)
├── api/        # FastAPI バックエンド (ポート 8001)
└── mastra/     # Mastra AI エージェントサーバー (ポート 4111)