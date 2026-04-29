'use client';

import { useState } from 'react';
import Link from "next/link";
import { useLanguage } from "@/lib/contexts";
import { Tier, getTierAccess, getQuality, cn } from "@/lib/utils";
import { toggleFavorite, trackRecentlyWatched } from "@/app/actions/features";
import WatchButton from "@/components/WatchButton";
import MovieMedia from "@/components/MovieMedia";
import Rating from "@/components/Rating";
import AdBanner from "@/components/AdBanner";
import { Heart, Download, Info, ShieldAlert, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieDetailContentProps {
  movie: any;
  user: any;
  isFavorite: boolean;
  userRating: number;
}

// Triggering a rebuild to ensure Button is picked up correctly.
export default function MovieDetailContent({ 
  movie, 
  user, 
  isFavorite: initialIsFavorite,
  userRating 
}: MovieDetailContentProps) {
  const { t } = useLanguage();
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const userTier: Tier = user?.subscription_tier || 'none';
  const hasAccess = getTierAccess(userTier, movie.tier_required);
  const quality = getQuality(userTier);
  const showAds = userTier === 'starter';
  const canDownload = userTier === 'premium';

  const handleToggleFavorite = async () => {
    if (!user) return;
    setFavorite(!favorite);
    await toggleFavorite(user.id, movie.id);
  };

  const onTrailerPlay = async () => {
    if (user) {
      await trackRecentlyWatched(user.id, movie.id);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-secondary/80">
            ←
          </span>
          {t('back')}
        </Link>
        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleFavorite}
            className={cn("rounded-full gap-2 transition-all hover:bg-red-50 dark:hover:bg-red-950/20", favorite && "text-red-500 hover:text-red-600")}
          >
            <Heart className={cn("h-5 w-5 transition-transform active:scale-125", favorite && "fill-current")} />
            <span>{t('favorites')}</span>
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <MovieMedia 
              title={movie.title} 
              thumbnailUrl={movie.thumbnail_url} 
              trailerUrl={movie.trailer_url}
              userTier={userTier}
              onPlay={onTrailerPlay}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('quality')}: {quality}
            </div>
            {movie.tier_required !== 'none' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t('subscription')}: {t(movie.tier_required)}
              </div>
            )}
            {canDownload && (
               <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                 <Download className="h-4 w-4" />
                 {t('download')}
               </Button>
            )}
          </div>

          {showAds && (
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3 text-yellow-700 dark:text-yellow-500 text-sm">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t('ads')}</p>
            </div>
          )}

          {!hasAccess && (
             <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-xl mb-1">{t('upgrade_required')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('upgrade_message')} <span className="font-bold text-foreground">{t(movie.tier_required)}</span>.</p>
                </div>
                <Button asChild size="lg" className="rounded-2xl px-8">
                  <Link href="/settings">{t('change_tier')}</Link>
                </Button>
             </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-card p-6 md:p-8 shadow-xl border border-border/50 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {movie.genre}
              </span>
              <span className="text-sm font-medium text-muted-foreground">{movie.release_year}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">{movie.title}</h1>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-8">{movie.description}</p>
            
            {user && (
              <div className="pt-6 border-t border-border/50 space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">{t('rate_movie')}</p>
                <Rating movieId={movie.id} userId={user.id} initialRating={userRating} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <WatchButton 
              movieId={movie.id} 
              userId={user?.id || null} 
              hasAccess={hasAccess}
            />
            <AdBanner userTier={userTier} />
          </div>
        </div>
      </div>
    </div>
  );
}
