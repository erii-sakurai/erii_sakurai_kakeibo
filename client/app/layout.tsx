import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "家計簿アプリ",
  description: "Next.jsで作る家計簿アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {/* 全ページ共通のヘッダーナビゲーション */}
        <header className="bg-white shadow-sm mb-8">
          <div className="max-w-2xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              💰 家計簿アプリ
            </Link>
            <nav>
              <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium">
                ＋ 新規登録
              </Link>
            </nav>
          </div>
        </header>
        
        {/* ページの中身（page.tsx の内容）がここに入ります */}
        {children}
      </body>
    </html>
  );
}