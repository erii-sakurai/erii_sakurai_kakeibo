'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('本当にこの取引を削除しますか？')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('削除に失敗しました');
      }
    } catch {
      alert('エラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded transition-colors disabled:opacity-50"
    >
      {isDeleting ? '...' : '削除'}
    </button>
  );
}