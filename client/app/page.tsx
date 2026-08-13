import Link from "next/link";

// 1. ダミーデータの定義
const dummyTransactions = [
  { id: "1", date: "2026-08-10", type: "expense", amount: 600, category: "カフェ", memo: "オーツミルク変更" },
  { id: "2", date: "2026-08-11", type: "expense", amount: 5500, category: "美容", memo: "ネイルサロン" },
  { id: "3", date: "2026-08-12", type: "expense", amount: 8000, category: "娯楽", memo: "横浜スタジアム 野球観戦＆クラフトビール" },
  { id: "4", date: "2026-08-15", type: "income", amount: 200000, category: "給与", memo: "8月分お給料" },
];

export default function Home() {
  // 2. 画面のUI構築
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">入出金記録一覧</h1>
      
      {/* 絞り込みボタン（機能は後で実装します） */}
      <div className="mb-6 flex gap-4">
        <button className="bg-gray-200 px-4 py-2 rounded font-bold">すべて</button>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded">収入のみ</button>
        <button className="bg-red-100 text-red-700 px-4 py-2 rounded">支出のみ</button>
      </div>

      {/* リスト表示部分 */}
      <div className="space-y-4">
        {dummyTransactions.map((tx) => (
          <div key={tx.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{tx.date} - {tx.category}</p>
              <p className="font-medium">{tx.memo}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}円
              </p>
              {/* 詳細画面へのリンク */}
              <Link href={`/transactions/${tx.id}`} className="text-sm text-blue-500 underline mt-1 inline-block">
                詳細を見る
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}