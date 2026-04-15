'use client';

import { useState } from 'react';
import { purchaseMovie } from '@/app/actions/movies';
import { useRouter } from 'next/navigation';

interface PurchaseButtonProps {
  movieId: number;
  userId: number | null;
  price: number;
  isPurchased: boolean;
}

export default function PurchaseButton({ movieId, userId, price, isPurchased }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    if (isPurchased) {
      alert('Enjoy the movie!');
      return;
    }

    setLoading(true);
    try {
      const result = await purchaseMovie(userId, movieId);
      if (result.success) {
        alert('Purchase successful!');
        router.refresh();
      } else {
        alert(result.error || 'Failed to purchase movie');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      type="button"
      className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 disabled:opacity-50"
    >
      {loading ? 'Processing...' : isPurchased ? 'Watch now' : `Start watching — $${price}`}
    </button>
  );
}
