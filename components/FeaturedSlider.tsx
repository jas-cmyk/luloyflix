'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Movie } from '@/app/actions/movies';
import { Button } from './ui/button';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedSliderProps {
  movies: Movie[];
}

export default function FeaturedSlider({ movies }: FeaturedSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovering || movies.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isHovering, movies.length]);

  if (!movies || movies.length === 0) return null;

  return (
    <div 
      className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden group shadow-2xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform",
              index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            )}
          >
            {/* Background Image with Parallax-like effect */}
            <div className="absolute inset-0">
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end md:justify-center pb-16 md:pb-0 px-6 md:px-16 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
                {movie.genres.map((genre) => (
                  <span key={genre} className="px-2 md:px-3 py-0.5 md:py-1 bg-primary/20 backdrop-blur-md text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full border border-primary/20">
                    {genre}
                  </span>
                ))}
                <span className="text-white/60 text-xs md:text-sm font-medium">{movie.release_year}</span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-4 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                {movie.title}
              </h2>

              <p className="text-sm md:text-lg text-white/80 line-clamp-2 md:line-clamp-3 mb-6 md:mb-8 max-w-xl animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                {movie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-left-10 duration-700 delay-300">
                <Button asChild size="lg" className="h-10 md:h-12 rounded-xl md:rounded-2xl px-6 md:px-8 gap-2 font-bold shadow-lg shadow-primary/20 text-sm md:text-base">
                  <Link href={`/movies/${movie.id}`}>
                    <Play className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                    Watch Now
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="h-10 md:h-12 rounded-xl md:rounded-2xl px-6 md:px-8 gap-2 font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10 text-white text-sm md:text-base">
                  <Link href={`/movies/${movie.id}`}>
                    <Info className="h-4 w-4 md:h-5 md:w-5" />
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10 hidden md:flex"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10 hidden md:flex"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  index === current ? "w-6 md:w-8 bg-primary shadow-lg shadow-primary/50" : "w-1.5 md:w-2 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
