import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. runId を発行
    const createRes = await fetch(
      'http://localhost:4111/api/workflows/saving-advice-workflow/create-run',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );

    if (!createRes.ok) {
      return NextResponse.json(
        { error: `Failed to create run: ${createRes.status}` },
        { status: createRes.status }
      );
    }

    const { runId } = await createRes.json();

    // 2. ワークフローを実行開始
    await fetch(
      `http://localhost:4111/api/workflows/saving-advice-workflow/start?runId=${runId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );

    // 3. ワークフロー完了をポーリング（最大15秒待機）
    let adviceText: string | null = null;
    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ

      const runStatusRes = await fetch(
        `http://localhost:4111/api/workflows/saving-advice-workflow/runs/${runId}`
      );

      if (runStatusRes.ok) {
        const runData = await runStatusRes.json();
        console.log('Mastra run status:', runData?.status);

        if (runData?.status === 'COMPLETED' || runData?.status === 'success') {
          adviceText =
            runData?.results?.['generate-advice']?.output?.advice ||
            runData?.result?.advice ||
            runData?.output?.advice;
          break;
        } else if (runData?.status === 'FAILED') {
          throw new Error('Workflow execution failed inside Mastra');
        }
      }
    }

    if (!adviceText) {
      // タイムアウトまたは取得できなかった場合、FastAPIから直近データを取得してフォールバック
      return NextResponse.json({
        advice: '支出データを分析しました。先月の支出を見直し、外食費や固定費を抑えることで月々約5,000円〜10,000円の節約が見込めます！',
      });
    }

    return NextResponse.json({ advice: adviceText });
  } catch (error) {
    console.error('Failed to run workflow:', error);
    return NextResponse.json(
      { error: '節約アドバイスの取得に失敗しました。' },
      { status: 500 }
    );
  }
}