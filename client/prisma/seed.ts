import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 既存のデータをクリアしてリセット
  await prisma.transaction.deleteMany();

  // 初期データを登録
  await prisma.transaction.createMany({
    data: [
      {
        id: 1, // IDを1にしておくことで /transactions/1 にアクセスできます
        date: "2026-08-01",
        type: "income",
        amount: 350000,
        category: "給与",
        memo: "8月分のお給料",
      },
      {
        id: 2,
        date: "2026-08-10",
        type: "expense",
        amount: 500,
        category: "食費",
        memo: "タリーズコーヒーでオーツミルクラテ",
      },
      {
        id: 3,
        date: "2026-08-15",
        type: "expense",
        amount: 8000,
        category: "趣味",
        memo: "横浜スタジアムで野球観戦＋ビール",
      },
    ],
  });

  console.log("データベースに初期データを登録しました！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });