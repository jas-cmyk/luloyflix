import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "./Sidebar";
import NavbarContent from "./NavbarContent";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[500]">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-4">
          <Sidebar user={user} logoutAction={logout} />
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
            <img src="/logo.png" alt="Luloy Flix Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-black tracking-tighter shrink-0 hidden sm:block">
              Luloy <span className="text-primary">Flix</span>
            </span>
          </Link>
        </div>
        
        <NavbarContent user={user} logoutAction={logout} />
      </div>
    </header>
  );
}
