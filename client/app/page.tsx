import Link from 'next/link';
import DeleteButton from './components/DeleteButton';
import SavingAdvice from './components/SavingAdvice'; // 追加

interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description: string | null;
}

interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
}

async function getTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch('http://localhost:8000/api/transactions', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getSummary(): Promise<Summary | null> {
  try {
    const res = await fetch('http://localhost:8000/api/transactions/summary', {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [transactions, summary] = await Promise.all([
    getTransactions(),
    getSummary(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">家計簿アプリ</h1>
            <p className="text-sm text-slate-500">Section 5-1: Mastra AI エージェント & ワークフロー連携</p>
          </div>
          <Link
            href="/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
          >
            ＋ 新規登録
          </Link>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-500">総収入</span>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              +¥{summary?.total_income.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-500">総支出</span>
            <p className="text-2xl font-bold text-rose-600 mt-2">
              -¥{summary?.total_expense.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-500">収支差額</span>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ¥{summary?.balance.toLocaleString() ?? 0}
            </p>
          </div>
        </div>

        {/* AI 節約アドバイザー（ワークフロー連携） */}
        <SavingAdvice />

        {/* 取引明細一覧 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">取引明細一覧</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                  <th className="px-6 py-3">日付</th>
                  <th className="px-6 py-3">カテゴリ</th>
                  <th className="px-6 py-3">内容</th>
                  <th className="px-6 py-3 text-right">金額</th>
                  <th className="px-6 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      取引データがありません
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{tx.description || '-'}</td>
                      <td
                        className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}¥{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                        <Link
                          href={`/edit/${tx.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                        >
                          編集
                        </Link>
                        <DeleteButton id={tx.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}