import { getMovies } from "@/app/actions/movies";
import { getMostRatedMovies } from "@/app/actions/features";
import { getCurrentUser } from "@/lib/auth";
import { Tier } from "@/lib/utils";
import Link from "next/link";
import { Trophy, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MostRatedPage() {
  const ranking = await getMostRatedMovies(10);
  const allMovies = await getMovies();
  const user = await getCurrentUser();
  const userTier: Tier = user?.subscription_tier || 'none';

  const topMovies = ranking
    .map((r) => {
      const movie = allMovies.find((m) => m.id === r.movie_id);
      return movie ? { ...movie, average: r.average, votes: r.count } : null;
    })
    .filter(Boolean) as (any & { average: number, votes: number })[];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <Link 
          href="/" 
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-2">
          <Star className="h-10 w-10 text-primary fill-primary" />
          <h1 className="text-4xl font-black tracking-tight">Most Rated</h1>
        </div>
        <p className="text-muted-foreground">
          Top 10 movies based on average user ratings and vote count.
        </p>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto">
        {topMovies.map((movie, index) => (
          <div key={movie.id} className="flex items-center gap-6 group">
            <div className="text-5xl md:text-7xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors w-16 md:w-24 shrink-0 italic">
              #{index + 1}
            </div>
            <div className="flex-1 bg-card rounded-3xl border border-border/50 p-4 md:p-6 shadow-xl flex gap-6 items-center hover:border-primary/30 transition-all overflow-hidden relative">
               <div className="w-24 md:w-32 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-lg">
                 <img src={movie.thumbnail_url} alt={movie.title} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex flex-wrap items-center gap-2 mb-2">
                   <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md">
                     {movie.genre}
                   </span>
                   <span className="text-xs text-muted-foreground">{movie.release_year}</span>
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold truncate mb-2">{movie.title}</h2>
                 <p className="text-sm text-muted-foreground line-clamp-2 hidden md:block mb-4">{movie.description}</p>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                       <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                       <span className="font-black text-lg">{movie.average.toFixed(1)}</span>
                       <span className="text-xs text-muted-foreground">({movie.votes} {movie.votes === 1 ? 'vote' : 'votes'})</span>
                    </div>
                    <Link href={`/movies/${movie.id}`} className="text-xs font-bold text-primary hover:underline">
                       View Details
                    </Link>
                 </div>
               </div>
               {index === 0 && (
                 <div className="absolute top-4 right-4 text-yellow-500">
                    <Trophy className="h-6 w-6" />
                 </div>
               )}
            </div>
          </div>
        ))}

        {topMovies.length === 0 && (
           <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <p className="text-muted-foreground">No rating data available yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
