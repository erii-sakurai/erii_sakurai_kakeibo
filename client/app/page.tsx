import { Suspense } from 'react';

// 取引データの型定義
interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string;
}

// 収支サマリーの型定義
interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
}

// FastAPI から取引一覧を取得
async function getTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch('http://localhost:8000/api/transactions', {
      cache: 'no-store', // 常に最新データを取得
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// FastAPI からサマリーを取得
async function getSummary(): Promise<Summary | null> {
  try {
    const res = await fetch('http://localhost:8000/api/transactions/summary', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function HomePage() {
  const [transactions, summary] = await Promise.all([
    getTransactions(),
    getSummary(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">家計簿アプリ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Section 4-3: Next.js × FastAPI 連携
          </p>
        </header>

        {/* 収支サマリーカード */}
        {summary && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-500">総収入</span>
              <p className="text-2xl font-bold text-green-600 mt-1">
                +¥{summary.total_income.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-500">総支出</span>
              <p className="text-2xl font-bold text-red-600 mt-1">
                -¥{summary.total_expense.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-500">収支差額</span>
              <p
                className={`text-2xl font-bold mt-1 ${
                  summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                ¥{summary.balance.toLocaleString()}
              </p>
            </div>
          </section>
        )}

        {/* 取引一覧テーブル */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">取引明細一覧</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">日付</th>
                  <th className="px-6 py-3 text-left font-medium">カテゴリ</th>
                  <th className="px-6 py-3 text-left font-medium">内容</th>
                  <th className="px-6 py-3 text-right font-medium">金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      取引データがありません
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600">{t.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{t.description || '-'}</td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          t.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}