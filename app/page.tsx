export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/auth";
import { getMovies, getUserPurchases } from "./actions/movies";
import { getMovieRatings, getMostViewedMovies } from "./actions/features";
import HomeContent from "@/components/HomeContent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  
  // Fetch movies, user, and most viewed in parallel
  const [movies, user, mostViewedRanking] = await Promise.all([
    getMovies(),
    getCurrentUser(),
    getMostViewedMovies(5)
  ]);

  const userPurchases = user ? await getUserPurchases(user.id) : [];

  // Filter most viewed movies from all movies
  const mostViewedMovies = mostViewedRanking
    .map(r => movies.find(m => m.id === r.movie_id))
    .filter(Boolean) as typeof movies;

  let filteredMovies = movies;
  if (q) {
    filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(q.toLowerCase()) ||
      movie.genres.some(genre => genre.toLowerCase().includes(q.toLowerCase()))
    );
  }

  // Group movies by genre
  const groupedMovies = filteredMovies.reduce((acc, movie) => {
    const genres = movie.genres.length > 0 ? movie.genres : ["Other"];
    genres.forEach(genre => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      // Avoid duplicate movies in the same genre if for some reason they have it twice
      if (!acc[genre].find(m => m.id === movie.id)) {
        acc[genre].push(movie);
      }
    });
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
          userPurchases={userPurchases}
          mostViewedMovies={mostViewedMovies}
        />
      </main>

      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Luloy Flix. All rights reserved.</p>
      </footer>
    </div>
  );
}
