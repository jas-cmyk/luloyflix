'use client';

import { useLanguage } from "@/lib/contexts";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tier } from "@/lib/utils";

interface HomeContentProps {
  q?: string;
  groupedMovies: Record<string, any[]>;
  movies: any[];
  movieRatings: Record<number, { average: number, count: number }>;
  userTier: Tier;
}

export default function HomeContent({ 
  q, 
  groupedMovies, 
  movies, 
  movieRatings,
  userTier
}: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {q ? (
        <>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              {t('search_results')} "{q}"
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('showing')} {movies.length} {t('results')} {t('for')} "{q}".
            </p>
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  averageRating={movieRatings[movie.id]?.average || 0}
                  userTier={userTier}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">{t('no_movies_found')}</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/">{t('clear_search')}</Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{t('explore')}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('explore_description')}
            </p>
          </div>

          <div className="space-y-16">
            {Object.entries(groupedMovies).map(([genre, genreMovies]) => (
              <section key={genre} className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">{genre}</h2>
                  <span className="text-sm text-muted-foreground">{genreMovies.length} {t('movies')}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {genreMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      averageRating={movieRatings[movie.id]?.average || 0}
                      userTier={userTier}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}
