'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// --- Theme Context ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// --- Language Context ---
type Language = 'en' | 'tl';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    search: 'Search movies...',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    home: 'Home',
    settings: 'Settings',
    explore: 'Explore Movies',
    explore_description: 'Explore our curated selection of high-quality films, organized by genre for your convenience.',
    favorites: 'Favorites',
    recent: 'Recently Watched',
    back: 'Back to movies',
    watch: 'Watch now',
    purchase: 'Start watching — ₱',
    genre: 'Genre',
    year: 'Year',
    download: 'Download',
    quality: 'Quality',
    ads: 'Ads included',
    subscription: 'Subscription',
    starter: 'Starter',
    plus: 'Plus',
    premium: 'Premium',
    none: 'None',
    change_tier: 'Change Subscription Tier',
    theme: 'Theme',
    language: 'Language',
    search_results: 'Search Results for',
    showing: 'Showing',
    results: 'results',
    for: 'for',
    no_movies_found: 'No movies found matching your search.',
    clear_search: 'Clear search',
    movies: 'Movies',
    view_details: 'View details',
    upgrade_required: 'Upgrade Required',
    upgrade_message: 'This movie requires a subscription tier of at least',
    rate_movie: 'Rate this movie',
    manage_account: 'Manage your account and subscription',
    current_tier: 'Current Plan',
    select: 'Select',
    no_history: 'No recently watched movies.',
    no_favorites: 'No favorite movies yet.',
  },
  tl: {
    search: 'Maghanap ng pelikula...',
    login: 'Mag-login',
    signup: 'Mag-sign Up',
    logout: 'Mag-logout',
    home: 'Home',
    settings: 'Settings',
    explore: 'Galugarin ang mga Pelikula',
    explore_description: 'Galugarin ang aming na-curate na seleksyon ng mga de-kalidad na pelikula, na inayos ayon sa genre para sa iyong kaginhawaan.',
    favorites: 'Mga Paborito',
    recent: 'Kamakailang Pinanood',
    back: 'Bumalik sa mga pelikula',
    watch: 'Panoorin na',
    purchase: 'Simulan ang panonood — ₱',
    genre: 'Genre',
    year: 'Taon',
    download: 'I-download',
    quality: 'Kalidad',
    ads: 'May mga patalastas',
    subscription: 'Susunod',
    starter: 'Starter',
    plus: 'Plus',
    premium: 'Premium',
    none: 'Wala',
    change_tier: 'Baguhin ang Subscription Tier',
    theme: 'Tema',
    language: 'Wika',
    search_results: 'Mga Resulta ng Paghahanap para sa',
    showing: 'Ipinapakita ang',
    results: 'mga resulta',
    for: 'para sa',
    no_movies_found: 'Walang pelikulang nahanap na tumutugma sa iyong paghahanap.',
    clear_search: 'I-clear ang paghahanap',
    movies: 'Mga Pelikula',
    view_details: 'Tingnan ang mga detalye',
    upgrade_required: 'Kailangan ng Upgrade',
    upgrade_message: 'Ang pelikulang ito ay nangangailangan ng subscription tier na hindi bababa sa',
    rate_movie: 'I-rate ang pelikulang ito',
    manage_account: 'Pamahalaan ang iyong account at subscription',
    current_tier: 'Kasalukuyang Plan',
    select: 'Pumili',
    no_history: 'Walang kamakailang pinanood na mga pelikula.',
    no_favorites: 'Wala pang paboritong pelikula.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
