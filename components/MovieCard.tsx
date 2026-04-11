'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  release_year: number;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={movie.thumbnail_url}
          alt={movie.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-black rounded-full px-4 py-2 font-semibold text-sm">
            Play
          </button>
        </div>
      </div>
      <CardContent className="pt-3 px-1">
        <h3 className="font-bold text-sm truncate">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">
          {movie.release_year} • {movie.genre}
        </p>
      </CardContent>
    </Card>
  );
}
