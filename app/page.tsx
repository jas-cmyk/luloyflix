import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMovies } from "./actions/movies";
import MovieCard from "@/components/MovieCard";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "./actions/auth";

export default async function Home() {
  const movies = await getMovies();
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Luloy Flix
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <form action={logout}>
                  <Button type="submit" variant="ghost" size="sm">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero-like Title Section */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Featured Movies</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our curated selection of high-quality films. Simple, clean, and ready to stream.
          </p>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <p>© 2026 Luloy Flix. All rights reserved.</p>
      </footer>
    </div>
  );
}
