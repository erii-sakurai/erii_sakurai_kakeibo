import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ① Zodを使ったバリデーションルール（Recordテーブルの項目に合わせる）
const recordSchema = z.object({
  date: z.string().min(1, "日付は必須です"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(1, "金額は1円以上にしてください"),
  category: z.string().min(1, "カテゴリは必須です"),
  title: z.string().min(1, "タイトル・メモは必須です"),
});

export default function NewRecordPage() {
  // ② フォームが送信された時に動く「サーバーアクション」
  async function createRecord(formData: FormData) {
    "use server";

    const rawData = {
      date: formData.get("date"),
      type: formData.get("type"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      title: formData.get("title"), // memoからtitleに変更
    };

    const validatedData = recordSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.error(validatedData.error.flatten());
      throw new Error("入力データに誤りがあります。");
    }

    // ③ データベース(Recordテーブル)に保存。日付はDate型に変換する
    await prisma.transaction.create({
      data: {
        title: validatedData.data.title,
        amount: validatedData.data.amount,
        type: validatedData.data.type,
        category: validatedData.data.category,
        date: new Date(validatedData.data.date),
      },
    });

    // ④ 保存が終わったら一覧画面に戻る
    redirect("/");
  }

  return (
    <main className="container mx-auto p-8 max-w-md">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 一覧に戻る
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新しい記録を追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRecord} className="space-y-4">
            <div>
              <label className="text-sm font-medium">日付</label>
              <Input type="date" name="date" required />
            </div>

            <div>
              <label className="text-sm font-medium">収支タイプ</label>
              <div className="flex gap-4 mt-1">
                <label className="cursor-pointer">
                  <input type="radio" name="type" value="expense" defaultChecked className="mr-1" /> 支出
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="type" value="income" className="mr-1" /> 収入
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">カテゴリ</label>
              <Input type="text" name="category" placeholder="例: 食費、交通費など" required />
            </div>

            <div>
              <label className="text-sm font-medium">タイトル・メモ</label>
              <Input type="text" name="title" placeholder="例: リンドウくんの絵本代" required />
            </div>

            <div>
              <label className="text-sm font-medium">金額 (円)</label>
              <Input type="number" name="amount" placeholder="0" min="1" required />
            </div>

            <Button type="submit" className="w-full">
              登録する
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}