'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { rateMovie } from '@/app/actions/features';
import { cn } from '@/lib/utils';

interface RatingProps {
  movieId: number;
  userId: number;
  initialRating: number;
}

export default function Rating({ movieId, userId, initialRating }: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRate = async (value: number) => {
    setRating(value);
    await rateMovie(userId, movieId, value);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              (hover || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            )}
          />
        </button>
      ))}
    </div>
  );
}
