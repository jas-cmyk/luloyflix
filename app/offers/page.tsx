import { getCurrentUser } from "@/lib/auth";
import { getBundles } from "@/app/actions/movies";
import { redirect } from "next/navigation";
import OffersContent from "../../components/OffersContent";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const user = await getCurrentUser();
  const bundles = await getBundles();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight mb-4">Limited Time Offers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Grab these exclusive movie bundles and save up to 40% on your favorite titles. 
          Each bundle unlocks multiple movies for a single low price.
        </p>
      </div>

      <OffersContent user={user} bundles={bundles} />
    </div>
  );
}
