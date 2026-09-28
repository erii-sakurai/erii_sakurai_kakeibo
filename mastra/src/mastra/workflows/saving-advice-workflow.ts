import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { kakeiboAgent } from '../agents/kakeibo-agent';

// Step 1: FastAPI から取引データを取得
const fetchTransactionsStep = createStep({
  id: 'fetch-transactions',
  inputSchema: z.object({}),
  outputSchema: z.object({
    transactions: z.array(z.any()),
  }),
  execute: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transactions');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return { transactions: data };
    } catch (error) {
      return { transactions: [] };
    }
  },
});

// Step 2: 取得したデータをもとに節約アドバイスを生成
const generateAdviceStep = createStep({
  id: 'generate-advice',
  inputSchema: z.object({
    transactions: z.array(z.any()),
  }),
  outputSchema: z.object({
    advice: z.string(),
  }),
  execute: async ({ context }) => {
    const transactions = (context as any)?.input?.transactions || [];

    const prompt = `
以下の家計簿の取引履歴をもとに、支出の傾向を分析し、ユーザーに向けた具体的で親しみやすい節約アドバイスを300文字程度で作成してください。

取引データ:
${JSON.stringify(transactions, null, 2)}
    `;

    const response = await kakeiboAgent.generate(prompt);
    return { advice: response.text };
  },
});

// ワークフローの構築
export const savingAdviceWorkflow = createWorkflow({
  id: 'saving-advice-workflow',
  name: 'Saving Advice Workflow',
  inputSchema: z.object({}),
  outputSchema: z.object({
    advice: z.string(),
  }),
})
  .then(fetchTransactionsStep)
  .then(generateAdviceStep)
  .commit();