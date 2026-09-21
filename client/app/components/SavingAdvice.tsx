'use client';

import { useState } from 'react';

export default function SavingAdvice() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      // 自前の Next.js API Route を呼ぶ
      const response = await fetch('/api/advice', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Mastra のレスポンス形式に応じて抽出
      const resultAdvice =
        data?.result?.advice ||
        data?.advice ||
        (typeof data === 'string' ? data : JSON.stringify(data));
      setAdvice(resultAdvice);
    } catch (err) {
      console.error(err);
      setError('節約アドバイスの取得に失敗しました。Mastraサーバーが起動しているか確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">🤖 AI 節約アドバイザー</h2>
          <p className="text-xs text-slate-500 mt-0.5">現在の支出データをもとに改善ポイントを提案します</p>
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-lg transition-colors shadow-sm"
        >
          {loading ? '分析中...' : 'アドバイスをもらう'}
        </button>
      </div>

      {error && <p className="text-xs text-rose-500 mt-3">{error}</p>}

      {advice && (
        <div className="mt-4 p-4 text-sm text-slate-700 bg-indigo-50/50 border border-indigo-100 rounded-lg whitespace-pre-wrap leading-relaxed">
          {advice}
        </div>
      )}
    </div>
  );
}