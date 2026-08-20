import Link from "next/link";
import { prisma } from "@/lib/prisma"; // さっき作ったPrismaをインポート

// データをデータベースから取得するため、関数に async をつけます
export default async function Home() {
  // Prismaを使って、データベースからすべての入出金データを新しい順に取得
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💰 家計簿アプリ - 入出金記録一覧</h1>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <li key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <p className="text-sm text-gray-500">{tx.date} - <span className="font-semibold text-gray-700">{tx.category}</span></p>
                <p className="text-lg font-medium">{tx.memo || "メモなし"}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <span className={`text-lg font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}円
                </span>
                <Link 
                  href={`/transactions/${tx.id}`} 
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200 transition"
                >
                  詳細を見る
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}