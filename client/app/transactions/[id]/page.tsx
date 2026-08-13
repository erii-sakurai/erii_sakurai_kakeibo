import Link from "next/link";

const dummyTransactions = [
  { id: "1", date: "2026-08-10", type: "expense", amount: 600, category: "カフェ", memo: "オーツミルク変更" },
  { id: "2", date: "2026-08-11", type: "expense", amount: 5500, category: "美容", memo: "ネイルサロン" },
  { id: "3", date: "2026-08-12", type: "expense", amount: 8000, category: "娯楽", memo: "横浜スタジアム 野球観戦＆クラフトビール" },
  { id: "4", date: "2026-08-15", type: "income", amount: 200000, category: "給与", memo: "8月分お給料" },
];

// 変更点1: 関数に async をつけ、paramsの型を Promise に変更
export default async function TransactionDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // 変更点2: await を使って、パラメータの準備ができるのを待ってから id を取り出す
  const { id } = await params;
  const transaction = dummyTransactions.find((tx) => tx.id === id);

  if (!transaction) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center">
        <p>データが見つかりませんでした。</p>
        <Link href="/" className="text-blue-500 underline mt-4 inline-block">一覧に戻る</Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 入出金 詳細</h1>
      
      <div className="border p-6 rounded shadow-sm bg-white">
        <div className="mb-4">
          <p className="text-sm text-gray-500">日付</p>
          <p className="text-lg font-medium">{transaction.date}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">カテゴリ</p>
          <p className="text-lg font-medium">{transaction.category}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">金額</p>
          <p className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
            {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()}円
          </p>
        </div>
        <div className="mb-8">
          <p className="text-sm text-gray-500">メモ</p>
          <p className="text-lg font-medium">{transaction.memo}</p>
        </div>
        
        <div className="text-center">
          <Link href="/" className="bg-gray-200 px-6 py-2 rounded font-bold hover:bg-gray-300 transition">
            一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}