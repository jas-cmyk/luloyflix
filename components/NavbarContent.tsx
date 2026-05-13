'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/contexts";

interface NavbarContentProps {
  user: any;
  logoutAction: () => void;
}

export default function NavbarContent({ user, logoutAction }: NavbarContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex-1 max-w-[120px] xs:max-w-xs sm:max-w-md mx-1 xs:mx-2 md:mx-4 transition-all duration-300 focus-within:max-w-md">
        <form action="/" method="GET" className="relative">
          <Search className="absolute left-2 xs:left-2.5 top-2 xs:top-2.5 h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            placeholder={t('search')}
            className="pl-7 xs:pl-9 h-8 xs:h-10 w-full rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-xs xs:text-sm"
          />
        </form>
      </div>

      <div className="flex items-center gap-1 xs:gap-2 md:gap-4 shrink-0">
        {user ? (
          <>
            <div className="flex flex-col items-end mr-1 xs:mr-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider hidden sm:block">Balance</span>
              <div className="flex items-center gap-1">
                <Wallet className="h-3 w-3 text-primary xs:h-3.5 xs:w-3.5 sm:hidden" />
                <span className="text-xs sm:text-sm font-black text-primary leading-none">{user.credits || 0}</span>
                <span className="text-[10px] sm:text-sm font-bold sm:font-black text-primary hidden xs:inline">Credits</span>
              </div>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground hidden lg:inline border-l pl-4 border-border max-w-[150px] truncate">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="hidden lg:inline-flex h-8 md:h-9">
                {t('logout')}
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm" className="hidden xs:inline-flex h-8 md:h-9 px-2 xs:px-3 md:px-4 text-xs xs:text-sm">
              <Link href="/login">{t('login')}</Link>
            </Button>
            <Button asChild size="sm" className="h-8 xs:h-9 px-3 md:px-4 text-xs xs:text-sm">
              <Link href="/signup">{t('signup')}</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
