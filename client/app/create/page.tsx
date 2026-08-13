"use client"; // アラートなどのブラウザ機能を使うためのおまじない

import Link from "next/link";

export default function CreateTransaction() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">✨ 新規登録</h1>
      
      <form className="bg-white p-6 rounded shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">日付</label>
          <input type="date" className="border p-2 rounded w-full" required />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-1">種類</label>
          <select className="border p-2 rounded w-full">
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">カテゴリ</label>
          <input type="text" placeholder="例：カフェ、美容、給与など" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">金額（円）</label>
          <input type="number" placeholder="例：1000" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">メモ</label>
          <textarea placeholder="例：オーツミルクに変更" className="border p-2 rounded w-full" rows={3}></textarea>
        </div>

        <div className="mt-4 flex gap-4 justify-center">
          <Link href="/" className="bg-gray-200 px-6 py-2 rounded font-bold hover:bg-gray-300 transition">
            キャンセル
          </Link>
          {/* 今回のタスクではデータの登録処理はダミーでOKなので、押すとアラートが出るようにしています */}
          <button 
            type="button" 
            onClick={() => alert("※今はダミーなので登録されません！")} 
            className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 transition"
          >
            登録する
          </button>
        </div>
      </form>
    </main>
  );
}