import { getMovies } from "@/app/actions/movies";
import { getMovieRatings } from "@/app/actions/features";
import { getCurrentUser } from "@/lib/auth";
import MovieCard from "@/components/MovieCard";
import { Tier } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GenrePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const genreName = decodeURIComponent(name);
  const allMovies = await getMovies();
  const user = await getCurrentUser();
  const userTier: Tier = user?.subscription_tier || 'none';
  
  const genreMovies = allMovies.filter(
    (movie) => movie.genre.toLowerCase() === genreName.toLowerCase()
  );

  if (genreMovies.length === 0) {
    redirect('/');
  }

  const movieIds = genreMovies.map((m) => m.id);
  const movieRatings = await getMovieRatings(movieIds);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <Link 
          href="/" 
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black tracking-tight capitalize">{genreName} Movies</h1>
        <p className="text-muted-foreground mt-2">
          Browse our full collection of {genreMovies.length} {genreName.toLowerCase()} films.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {genreMovies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            averageRating={movieRatings[movie.id]?.average || 0}
            userTier={userTier}
          />
        ))}
      </div>
    </div>
  );
}
