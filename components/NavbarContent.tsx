'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/contexts";

interface NavbarContentProps {
  user: any;
  logoutAction: () => void;
}

export default function NavbarContent({ user, logoutAction }: NavbarContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex-1 max-w-md mx-2 md:mx-4">
        <form action="/" method="GET" className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            placeholder={t('search')}
            className="pl-9 w-full rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="hidden lg:inline-flex">
                {t('logout')}
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">{t('login')}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">{t('signup')}</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
