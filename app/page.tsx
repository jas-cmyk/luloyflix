export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/auth";
import { getMovies } from "./actions/movies";
import { getMovieRating } from "./actions/features";
import HomeContent from "@/components/HomeContent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let movies = await getMovies();
  const user = await getCurrentUser();

  if (q) {
    movies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(q.toLowerCase()) ||
      movie.genre.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Group movies by genre
  const groupedMovies = movies.reduce((acc, movie) => {
    const genre = movie.genre || "Other";
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(movie);
    return acc;
  }, {} as Record<string, typeof movies>);

  let movieRatings: Record<number, { average: number, count: number }> = {};

  // Fetch ratings for all movies
  for (const movie of movies) {
    movieRatings[movie.id] = await getMovieRating(movie.id);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-6 py-12">
        <HomeContent 
          q={q} 
          groupedMovies={groupedMovies} 
          movies={movies}
          movieRatings={movieRatings}
          userTier={user?.subscription_tier || 'none'}
        />
      </main>

      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Luloy Flix. All rights reserved.</p>
      </footer>
    </div>
  );
}
