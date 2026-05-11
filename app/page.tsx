export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/auth";
import { getMovies } from "./actions/movies";
import { getMovieRatings } from "./actions/features";
import HomeContent from "@/components/HomeContent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  
  // Fetch movies and user in parallel
  const [movies, user] = await Promise.all([
    getMovies(),
    getCurrentUser()
  ]);

  let filteredMovies = movies;
  if (q) {
    filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(q.toLowerCase()) ||
      movie.genre.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Group movies by genre
  const groupedMovies = filteredMovies.reduce((acc, movie) => {
    const genre = movie.genre || "Other";
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(movie);
    return acc;
  }, {} as Record<string, typeof movies>);

  // Fetch all ratings in a single query (Bulk optimization)
  const movieIds = filteredMovies.map(m => m.id);
  const movieRatings = await getMovieRatings(movieIds);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-6 py-12">
        <HomeContent 
          q={q} 
          groupedMovies={groupedMovies} 
          movies={filteredMovies}
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
