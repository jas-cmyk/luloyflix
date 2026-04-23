import { notFound } from "next/navigation";
import { getMovieById } from "@/app/actions/movies";
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
  const { id } = await params;
  const movie = await getMovieById(Number(id));

  if (!movie) {
    notFound();
  }

  const user = await getCurrentUser();
  const favorite = user ? await isFavorite(user.id, movie.id) : false;
  const userRating = user ? await getUserRating(user.id, movie.id) : 0;

  return (
    <MovieDetailContent 
      movie={movie} 
      user={user} 
      isFavorite={favorite}
      userRating={userRating}
    />
  );
}
