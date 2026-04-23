'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, Moon, Sun, Globe, Home, Heart, History, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme, useLanguage } from '@/lib/contexts';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: any;
  logoutAction: () => void;
}

export default function Sidebar({ user, logoutAction }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    ...(user ? [
      { href: '/settings', label: t('settings'), icon: Settings },
    ] : []),
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="relative z-[9999] lg:mr-2 h-10 w-10 rounded-full shadow-md border-border bg-background/50 backdrop-blur-md hover:bg-accent transition-all active:scale-95"
        aria-label="Toggle Menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-[300px] bg-background/80 backdrop-blur-2xl border-r border-border shadow-2xl z-[9999] overflow-y-auto transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-black tracking-tighter">Luloy <span className="text-primary">Flix</span></span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Profile Info */}
          {user && (
            <div className="mb-8 p-4 bg-muted/50 rounded-xl">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{t('subscription')}: {t(user.subscription_tier || 'none')}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions & Settings */}
          <div className="border-t pt-6 space-y-4">
            {/* Language Toggle */}
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{t('language')}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'tl')}
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer dark:text-white"
              >
                <option value="en" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">English</option>
                <option value="tl" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Tagalog</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
                <span className="text-sm font-medium">{t('theme')}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 px-2">
                {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
            </div>

            {/* Auth Actions (Mobile friendly) */}
            <div className="lg:hidden pt-4 space-y-2">
              {user ? (
                <form action={logoutAction}>
                  <Button variant="outline" className="w-full justify-start gap-3" type="submit">
                    <LogOut className="h-5 w-5" />
                    {t('logout')}
                  </Button>
                </form>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full justify-start gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-5 w-5" />
                      {t('login')}
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start gap-3">
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <UserPlus className="h-5 w-5" />
                      {t('signup')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
