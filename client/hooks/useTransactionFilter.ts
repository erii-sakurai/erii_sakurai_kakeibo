"use client";

import { useState, useMemo } from "react";

export type Transaction = {
  id: number;
  date: string;
  type: string;
  category: string;
  amount: number;
  memo?: string | null;
};

export function useTransactionFilter(initialTransactions: Transaction[]) {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return initialTransactions;
    return initialTransactions.filter((t) => t.type === filterType);
  }, [initialTransactions, filterType]);

  return {
    filterType,
    setFilterType,
    filteredTransactions,
  };
}