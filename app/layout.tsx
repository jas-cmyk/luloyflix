import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider, LanguageProvider } from "@/lib/contexts";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuloyFlix",
  description: "A Next.js movie streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased font-sans", inter.variable, geistSans.variable, geistMono.variable)} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
