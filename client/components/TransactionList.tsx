"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactionFilter, Transaction } from "@/hooks/useTransactionFilter";

export default function TransactionList({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) {
  const { filterType, setFilterType, filteredTransactions } =
    useTransactionFilter(initialTransactions);

  return (
    <div className="space-y-4">
      {/* 絞り込みボタン群 */}
      <div className="flex gap-2">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          onClick={() => setFilterType("all")}
          size="sm"
        >
          すべて
        </Button>
        <Button
          variant={filterType === "expense" ? "default" : "outline"}
          onClick={() => setFilterType("expense")}
          size="sm"
        >
          支出のみ
        </Button>
        <Button
          variant={filterType === "income" ? "default" : "outline"}
          onClick={() => setFilterType("income")}
          size="sm"
        >
          収入のみ
        </Button>
      </div>

      {/* 一覧リスト */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm">記録がありません。</p>
        ) : (
          filteredTransactions.map((item) => (
            <Link key={item.id} href={`/transactions/${item.id}`} className="block">
              <Card className="hover:bg-gray-50 transition">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 mr-2">{item.date}</span>
                    <span className="font-semibold">{item.category}</span>
                  </div>
                  <span
                    className={`font-bold ${
                      item.type === "income" ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {item.amount.toLocaleString()}円
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}