import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieById, isMoviePurchased } from "@/app/actions/movies";
import { getCurrentUser } from "@/lib/auth";
import PurchaseButton from "@/components/PurchaseButton";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovieById(Number(id));

  if (!movie) {
    notFound();
  }

  const user = await getCurrentUser();
  const isPurchased = user ? await isMoviePurchased(user.id, movie.id) : false;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
          ← Back to movies
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950/5 shadow-2xl">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white/95 p-8 shadow-lg ring-1 ring-slate-900/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                {movie.genre}
              </span>
              <span className="text-sm text-slate-500">{movie.release_year}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{movie.title}</h1>
            <p className="mt-6 text-base leading-7 text-slate-700">{movie.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse other movies
            </Link>
            <PurchaseButton 
              movieId={movie.id} 
              userId={user?.id || null} 
              price={movie.price} 
              isPurchased={isPurchased} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
