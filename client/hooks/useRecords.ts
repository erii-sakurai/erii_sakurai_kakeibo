"use client";

import { useState, useMemo } from "react";

export type RecordItem = {
  id: string | number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date | string;
};

export function useRecords(initialRecords: RecordItem[]) {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 絞り込み処理のメモ化
  const filteredRecords = useMemo(() => {
    return initialRecords.filter((record) => {
      const matchType = filterType === "all" || record.type === filterType;
      const matchCategory = selectedCategory === "all" || record.category === selectedCategory;
      return matchType && matchCategory;
    });
  }, [initialRecords, filterType, selectedCategory]);

  return {
    filteredRecords,
    filterType,
    setFilterType,
    selectedCategory,
    setSelectedCategory,
  };
}