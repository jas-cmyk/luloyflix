'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts';
import { Button } from './ui/button';
import { Play } from 'lucide-react';

interface WatchButtonProps {
  movieId: number;
  userId: number | null;
  hasAccess: boolean;
}

export default function WatchButton({ movieId, userId, hasAccess }: WatchButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();

  if (!hasAccess) return null;

  const handleWatch = () => {
    if (!userId) {
      router.push('/login');
      return;
    }
    // Logic for watching (e.g., play video)
    alert('Playing movie...');
  };

  return (
    <Button
      onClick={handleWatch}
      type="button"
      size="lg"
      className="rounded-2xl w-full h-14 text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 gap-3"
    >
      <Play className="h-6 w-6 fill-current" />
      {t('watch')}
    </Button>
  );
}
