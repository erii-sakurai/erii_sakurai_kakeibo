import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getTransactionsTool = createTool({
  id: 'get-transactions',
  description: 'FastAPIから家計簿の取引履歴一覧を取得します。金額、カテゴリ、日付、収支区分（income/expense）が含まれます。',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transactions');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'FastAPIからの家計簿データ取得に失敗しました。FastAPIが起動しているか確認してください。' };
    }
  },
});