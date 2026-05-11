import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminContent from "@/components/AdminContent";
import { 
  getAdminStats, 
  getAllUsers, 
  getAllTransactions, 
  getAdminAds, 
  getAdminRedeemCodes 
} from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || !user.is_admin) {
    redirect("/");
  }

  const [stats, users, transactions, ads, codes] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
    getAllTransactions(),
    getAdminAds(),
    getAdminRedeemCodes()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-12">
        <AdminContent 
          initialStats={stats}
          initialUsers={users}
          initialTransactions={transactions}
          initialAds={ads}
          initialCodes={codes}
        />
      </main>
    </div>
  );
}
