import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TransactionDetail({ params }: PageProps) {
  // Next.jsの最新仕様に合わせてparamsをawaitする
  const resolvedParams = await params;
  const transactionId = parseInt(resolvedParams.id, 10);

  // IDが数値でない場合は404ページを表示
  if (isNaN(transactionId)) {
    notFound();
  }

  // Prismaを使ってデータベースから該当する1件を取得
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  // データが見つからない場合
  if (!transaction) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center">
        <h1 className="text-xl font-bold mb-4 text-red-600">データが見つかりませんでした</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          ← 一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          ← 一覧に戻る
        </Link>
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{transaction.date}</span>
          <span
            className={`px-3 py-1 rounded text-sm font-bold ${
              transaction.type === "income"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {transaction.type === "income" ? "収入" : "支出"}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2">{transaction.category}</h1>
        
        <p className={`text-3xl font-extrabold mb-6 ${
          transaction.type === "income" ? "text-blue-600" : "text-red-600"
        }`}>
          {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()}円
        </p>

        <div className="border-t pt-4">
          <h2 className="text-sm text-gray-500 mb-1">メモ</h2>
          <p className="text-gray-800 bg-gray-50 p-3 rounded">
            {transaction.memo || "メモはありません"}
          </p>
        </div>
      </div>
    </main>
  );
}