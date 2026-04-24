'use client';

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/contexts";
import { Tier, getTierAccess, cn } from "@/lib/utils";

interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  release_year: number;
  tier_required: Tier;
}

export default function MovieCard({ 
  movie, 
  averageRating,
  userTier 
}: { 
  movie: Movie, 
  averageRating: number,
  userTier: Tier
}) {
  const { t } = useLanguage();
  const hasAccess = getTierAccess(userTier, movie.tier_required);

  const tierColors = {
    none: 'bg-slate-500',
    starter: 'bg-green-600',
    plus: 'bg-blue-600',
    premium: 'bg-purple-600',
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl group bg-card">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
          
          {/* Tier Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={cn(
              "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
              tierColors[movie.tier_required]
            )}>
              {t(movie.tier_required)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
              {movie.genre}
            </span>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-white">{averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="pt-4 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold truncate">{movie.title}</p>
          <p className="text-xs text-muted-foreground">{movie.release_year}</p>
        </div>
      </CardContent>

      <CardFooter className="justify-end px-4 pt-0 pb-4">
        <Link
          href={`/movies/${movie.id}`}
          className="w-full text-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90"
        >
          {hasAccess ? t('watch') : t('view_details')}
        </Link>
      </CardFooter>
    </Card>
  );
}
