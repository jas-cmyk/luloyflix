import { notFound } from "next/navigation";
import { getMovieById, hasPurchased } from "@/app/actions/movies";
import { getCurrentUser } from "@/lib/auth";
import { isFavorite, getUserRating } from "@/app/actions/features";
import MovieDetailContent from "@/components/MovieDetailContent";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const movie = await getMovieById(id);

  if (!movie) {
    notFound();
  }

  const user = await getCurrentUser();
  
  // Parallelize secondary data fetching
  const [favorite, userRating, purchased] = await Promise.all([
    user ? isFavorite(user.id, movie.id) : Promise.resolve(false),
    user ? getUserRating(user.id, movie.id) : Promise.resolve(0),
    user ? hasPurchased(user.id, movie.id) : Promise.resolve(false)
  ]);

  return (
    <MovieDetailContent 
      movie={movie} 
      user={user} 
      isFavorite={favorite}
      userRating={userRating}
      isPurchased={purchased}
    />
  );
}
