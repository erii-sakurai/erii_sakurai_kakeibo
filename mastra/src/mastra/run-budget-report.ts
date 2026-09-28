import { mastra } from './index';

// 動作確認用のサンプル家計簿データ（後で実際のAPIデータ等に置き換え可能）
const sampleKakeiboData = {
  month: '2026-09',
  income: 350000, // 月収（手取り）
  expenses: [
    { category: '住居費（家賃/住宅ローン）', amount: 95000 },
    { category: '食費・日用品', amount: 55000 },
    { category: '光熱費・水道', amount: 18000 },
    { category: '通信費（スマホ・Wi-Fi）', amount: 14000 },
    { category: 'サブスク・定期サービス', amount: 8000 },
    { category: '交際費・娯楽', amount: 32000 },
    { category: '交通費', amount: 10000 },
  ],
  currentSavings: 1500000, // 現在の預貯金
};

async function generateMonthlyReport() {
  console.log('🚀 マルチエージェントによる家計・資産形成レポート生成を開始します...\n');

  try {
    // 1. 家計診断エージェントの実行
    console.log('1/3 👤 [Budget Analyst] 家計データを分析中...');
    const analyst = mastra.getAgent('budgetAnalystAgent');
    const analystPrompt = `
以下の家計簿データを分析し、支出の偏り、削減ポイント、毎月投資や貯蓄に回せる余剰資金を算出してください。

データ:
${JSON.stringify(sampleKakeiboData, null, 2)}
`;
    const analystRes = await analyst.generate(analystPrompt);
    console.log('✔ 家計診断完了\n');

    // 2. 資産形成・市況エージェントの実行
    console.log('2/3 📈 [Market Advisor] 資産形成・市況視点のアドバイスを作成中...');
    const advisor = mastra.getAgent('marketAdvisorAgent');
    const advisorPrompt = `
以下の家計診断結果と余剰資金のデータをもとに、資産形成のアプローチ（インデックス積立・分散投資方針・市況リスクへの心構え）を提案してください。

【家計診断結果】
${analystRes.text}
`;
    const advisorRes = await advisor.generate(advisorPrompt);
    console.log('✔ 資産形成アドバイス作成完了\n');

    // 3. 総合レポート作成エージェントの実行
    console.log('3/3 📝 [Report Coordinator] 2つの結果を統合してレポートを編集中...');
    const coordinator = mastra.getAgent('reportCoordinatorAgent');
    const coordinatorPrompt = `
以下の2つの専門分析を統合し、ユーザー向けのわかりやすい月次レポート（Markdown形式）として出力してください。

【家計診断】
${analystRes.text}

【資産形成アドバイス】
${advisorRes.text}
`;
    const finalReport = await coordinator.generate(coordinatorPrompt);

    console.log('\n============================================================');
    console.log('🎉 【完成した家計・資産形成レポート】');
    console.log('============================================================\n');
    console.log(finalReport.text);
    console.log('\n============================================================');

  } catch (error) {
    console.error('レポート生成中にエラーが発生しました:', error);
  }
}

generateMonthlyReport();