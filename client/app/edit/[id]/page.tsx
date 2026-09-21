'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/transactions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('取引の取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        setCategory(data.category);
        setAmount(String(data.amount));
        setDate(data.date);
        setType(data.type);
        setDescription(data.description || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          date,
          type,
          description: description || null,
        }),
      });

      if (!res.ok) {
        throw new Error('更新に失敗しました');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-center">
        <p className="text-slate-500">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">取引の修正</h1>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← 一覧に戻る
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">収支区分</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 text-center rounded-lg border font-medium text-sm transition-colors ${
                  type === 'expense'
                    ? 'bg-rose-50 border-rose-500 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 text-center rounded-lg border font-medium text-sm transition-colors ${
                  type === 'income'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                収入
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">日付</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">カテゴリ</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">金額（円）</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">備考（任意）</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? '更新中...' : '更新する'}
          </button>
        </form>
      </div>
    </div>
  );
}