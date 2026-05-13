'use client';

import { useState } from 'react';
import Link from "next/link";
import { useLanguage } from "@/lib/contexts";
import { Tier, getQuality, cn } from "@/lib/utils";
import { toggleFavorite, trackRecentlyWatched } from "@/app/actions/features";
import { buyMovie } from "@/app/actions/movies";
import WatchButton from "@/components/WatchButton";
import MovieMedia from "@/components/MovieMedia";
import Rating from "@/components/Rating";
import AdBanner from "@/components/AdBanner";
import { Heart, Download, Info, ShoppingCart, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MovieDetailContentProps {
  movie: any;
  user: any;
  isFavorite: boolean;
  userRating: number;
  isPurchased: boolean;
}

// Triggering a rebuild to ensure Button is picked up correctly.
export default function MovieDetailContent({ 
  movie, 
  user, 
  isFavorite: initialIsFavorite,
  userRating,
  isPurchased: initialIsPurchased
}: MovieDetailContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const [isPurchased, setIsPurchased] = useState(initialIsPurchased);
  const [isBuying, setIsBuying] = useState(false);
  const userTier: Tier = user?.subscription_tier || 'none';
  const hasAccess = isPurchased;
  const quality = getQuality(userTier);
  const showAds = userTier === 'starter' || userTier === 'none';
  const canDownload = userTier === 'premium';

  const handleToggleFavorite = async () => {
    if (!user) return;
    setFavorite(!favorite);
    await toggleFavorite(user.id, movie.id);
  };

  const handleBuy = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsBuying(true);
    const res = await buyMovie(user.id, movie.id);
    if (res.success) {
      setIsPurchased(true);
      router.refresh();
    } else {
      alert(res.error || "Failed to purchase movie");
    }
    setIsBuying(false);
  };

  const onTrailerPlay = async () => {
    if (user) {
      await trackRecentlyWatched(user.id, movie.id);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-secondary/80 text-xs md:text-sm">
            ←
          </span>
          {t('back')}
        </Link>
        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleFavorite}
            className={cn("rounded-full gap-2 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 h-9 md:h-10", favorite && "text-red-500 hover:text-red-600")}
          >
            <Heart className={cn("h-4 w-4 md:h-5 md:w-5 transition-transform active:scale-125", favorite && "fill-current")} />
            <span className="hidden xs:inline">{t('favorites')}</span>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
        <div className="space-y-4 md:space-y-6">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl ring-1 ring-white/10 aspect-video md:aspect-auto">
            <MovieMedia 
              title={movie.title} 
              thumbnailUrl={movie.thumbnail_url} 
              trailerUrl={movie.trailer_url}
              userTier={userTier}
              onPlay={onTrailerPlay}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-secondary text-secondary-foreground rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-primary animate-pulse" />
              {t('quality')}: {quality}
            </div>
            {isPurchased ? (
              <div className="inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5" />
                Owned
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">

                NOT OWNED
              </div>
            )}
            {canDownload && (
               <Button variant="outline" size="sm" className="h-8 md:h-9 rounded-full gap-1.5 md:gap-2 border-primary/20 hover:bg-primary/5 text-[10px] md:text-xs">
                 <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                 {t('download')}
               </Button>
            )}
          </div>

          {showAds && (
            <div className="p-3 md:p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl md:rounded-2xl flex items-start gap-2 md:gap-3 text-yellow-700 dark:text-yellow-500 text-[10px] md:text-sm">
              <Info className="h-4 w-4 md:h-5 md:w-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t('ads')}</p>
            </div>
          )}

          {!hasAccess && (
             <div className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Unlock this Movie</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">Purchase this movie for <span className="font-bold text-foreground">{movie.price} Credits</span> to watch it anytime.</p>
                </div>
                <Button onClick={handleBuy} disabled={isBuying} size="lg" className="w-full sm:w-auto rounded-xl md:rounded-2xl px-6 md:px-8 h-10 md:h-12 text-sm md:text-base">
                  {isBuying ? "Processing..." : `Buy for ${movie.price} Credits`}
                </Button>
             </div>
          )}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="rounded-2xl md:rounded-3xl bg-card p-5 md:p-8 shadow-xl border border-border/50 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
              {movie.genres.map((genre: string) => (
                <span key={genre} className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider text-primary">
                  {genre}
                </span>
              ))}
              <span className="text-[11px] md:text-sm font-medium text-muted-foreground">{movie.release_year}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-3 md:mb-4 leading-tight">{movie.title}</h1>
            <p className="text-sm md:text-lg leading-relaxed text-muted-foreground mb-6 md:mb-8">{movie.description}</p>
            
            {user && (
              <div className="pt-4 md:pt-6 border-t border-border/50 space-y-3 md:space-y-4">
                <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-muted-foreground/80">{t('rate_movie')}</p>
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
