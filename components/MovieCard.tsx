'use client';

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  release_year: number;
  price: number;
}

export default function MovieCard({ movie, isPurchased }: { movie: Movie, isPurchased: boolean }) {
  return (
    <Card className="overflow-hidden border-none shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl group">
      <div className="relative overflow-hidden">
        <img
          src={movie.thumbnail_url}
          alt={movie.title}
          className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          {isPurchased ? (
            <span className="inline-flex items-center rounded-full bg-green-500/80 backdrop-blur-md px-3 py-1 text-sm font-bold text-white ring-1 ring-white/20">
              Purchased
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-950/60 backdrop-blur-md px-3 py-1 text-sm font-bold text-white ring-1 ring-white/20">
              ${movie.price}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
            {movie.genre}
          </span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            {movie.title}
          </h3>
        </div>
      </div>

      <CardContent className="pt-5 px-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold">{movie.title}</p>
            <p className="text-xs text-muted-foreground">{movie.release_year}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end px-4 pt-0 pb-4">
        <Link
          href={`/movies/${movie.id}`}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          {isPurchased ? 'Watch now' : 'View details'}
        </Link>
      </CardFooter>
    </Card>
  );
}
