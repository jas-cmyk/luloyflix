import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter text-emerald-500">
            LuloyFlix
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Sign In</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 animate-fade-in">
              NEW: STREAMING IN 4K
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 max-w-4xl mx-auto leading-[1.1]">
              Unlimited entertainment, <br/>
              <span className="text-emerald-500">unmatched quality.</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
              Stream thousands of movies and TV shows on all your devices. 
              Start your free trial today and experience the future of cinema.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-lg font-bold w-full sm:w-auto transition-transform hover:scale-105">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 border-zinc-800 text-white hover:bg-zinc-900 rounded-full text-lg font-bold w-full sm:w-auto">
                Browse Library
              </Button>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] -z-10" />
        </section>

        {/* Quick Features */}
        <section className="py-24 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold">Watch Everywhere</h3>
                <p className="text-zinc-400">Available on smart TVs, tablets, phones, and laptops.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold">Safe & Secure</h3>
                <p className="text-zinc-400">Industry-leading protection for your account and data.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold">Instant Stream</h3>
                <p className="text-zinc-400">Zero buffering with our global high-speed edge network.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-zinc-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black tracking-tighter text-emerald-500">
            LuloyFlix
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 LuloyFlix. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-300">Terms</Link>
            <Link href="#" className="hover:text-zinc-300">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
