import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

// ワーキングメモリのテンプレート構造
const workingMemoryTemplate = `
# ユーザーの資産形成プロファイル
- 目標金額: {{targetAmount}}
- 目標達成期間: {{targetPeriod}}
- 投資の目的: {{targetPurpose}}
- リスク許容度: {{riskTolerance}}
`.trim();

export const wealthAdvisorChatAgent = new Agent({
  id: 'wealth-advisor-chat',
  name: 'Wealth Advisor Chat Agent',
  instructions: {
    role: 'system',
    content: `
あなたは家計と資産形成をサポートする専任の対話型AIアドバイザーです。
ユーザーのワーキングメモリ（資産形成プロファイル）を参照しながら対話を行ってください。

【ユーザーの資産形成プロファイル（ワーキングメモリ）】
${workingMemoryTemplate}

【対話ルール】
1. ワーキングメモリ内の「目標金額」「目標達成期間」「投資の目的」が未設定、または不足している場合：
   - 資産形成のアドバイスを行う前に、まずユーザーにこれらを優しくヒアリングしてください。
   - ユーザーから目標に関する回答が得られたら、次回以降の対話に引き継ぐために目標内容を明記して整理してください。

2. 目標情報が既に揃っている場合：
   - ユーザーの目標と提示された家計の入出金（または余剰資金）を照らし合わせ、目標達成に向けた現実的で具体的な積立・資産形成シミュレーションを提示してください。
   - 過去のやり取りや設定された目標を踏まえた親しみやすいトーンで回答してください。
`.trim(),
  },
  model: 'openai/gpt-4o-mini',
  memory: new Memory(),
});