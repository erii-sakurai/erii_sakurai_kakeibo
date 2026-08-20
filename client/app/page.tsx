import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/TransactionList";

export default async function HomePage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">家計簿アプリ</h1>
        <Link href="/transactions/new">
          <Button>+ 新規記録</Button>
        </Link>
      </div>

      <TransactionList initialTransactions={transactions} />
    </main>
  );
}