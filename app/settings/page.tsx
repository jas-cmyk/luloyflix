import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMovies } from "@/app/actions/movies";
import { getFavorites, getRecentlyWatched } from "@/app/actions/features";
import SettingsContent from "@/components/SettingsContent";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const allMovies = await getMovies();
  const favoriteIds = await getFavorites(user.id);
  const recentIds = await getRecentlyWatched(user.id);

  const favoriteMovies = allMovies.filter(m => favoriteIds.includes(m.id));
  const recentMovies = allMovies.filter(m => recentIds.includes(m.id));

  return (
    <div className="container mx-auto px-6 py-12">
      <SettingsContent 
        user={user} 
        favoriteMovies={favoriteMovies} 
        recentMovies={recentMovies} 
      />
    </div>
  );
}
