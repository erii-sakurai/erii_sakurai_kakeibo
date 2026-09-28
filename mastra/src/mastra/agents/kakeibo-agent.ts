import { Agent } from '@mastra/core/agent';
import { getTransactionsTool } from '../tools/kakeibo-tool';

export const kakeiboAgent = new Agent({
  id: 'kakeibo-agent',
  name: 'Kakeibo Agent',
  instructions: `
    あなたは家計簿の専属アシスタントです。
    
    【役割と制約】
    - 提供されたツール（get-transactions）を使って取引データを取得し、ユーザーの家計状況や支出・収入に関する質問に正確に回答してください。
    - 金額やカテゴリ（食費、日用品など）、日付（今月、先月など）の集計・計算を行って分かりやすく伝えてください。
    - **【厳守】家計簿、支出、収入、節約、お金の管理に全く関係のない質問（天気、一般的な雑談、プログラミング、ニュースなど）をされた場合は、必ず「回答できません」とだけ回答してください。**
  `,
  model: 'openai/gpt-4o-mini',
  tools: {
    getTransactionsTool,
  },
});