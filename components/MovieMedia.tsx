"use client"

import { useState, useEffect } from "react"
import { Play, X, Info, ExternalLink } from "lucide-react"
import { Tier } from "@/lib/utils"
import { Ad, getActiveAds } from "@/app/actions/ads"
import Link from "next/link"

interface MovieMediaProps {
  title: string
  thumbnailUrl: string
  trailerUrl: string
  userTier?: Tier
  onPlay?: () => void
}

export default function MovieMedia({ title, thumbnailUrl, trailerUrl, userTier, onPlay }: MovieMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [currentAd, setCurrentAd] = useState<Ad | null>(null)
  const [adTimer, setAdTimer] = useState(5)

  const handlePlay = async () => {
    if (userTier === 'none' || userTier === 'starter') {
      const ads = await getActiveAds()
      if (ads.length > 0) {
        const randomAd = ads[Math.floor(Math.random() * ads.length)]
        setCurrentAd(randomAd)
        setShowAd(true)
        setAdTimer(5) // 5 second ad
        return
      }
    }
    
    setIsPlaying(true)
    if (onPlay) onPlay()
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showAd && adTimer > 0) {
      timer = setInterval(() => {
        setAdTimer((prev) => prev - 1)
      }, 1000)
    } else if (showAd && adTimer === 0) {
      setShowAd(false)
      setIsPlaying(true)
      if (onPlay) onPlay()
    }
    return () => clearInterval(timer)
  }, [showAd, adTimer, onPlay])

  return (
    <div className="relative overflow-hidden bg-slate-900 aspect-video">
      {!isPlaying && !showAd ? (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
          {trailerUrl && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group/btn"
            >
              <div className="bg-white/10 backdrop-blur-xl p-5 md:p-8 rounded-full border border-white/20 transform transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white/20 group-hover/btn:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white" />
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-3 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Play className="h-5 w-5 fill-current" />
                 </div>
                 <span className="text-white font-bold text-sm tracking-wide uppercase">Play Trailer</span>
              </div>
            </button>
          )}
        </>
      ) : showAd && currentAd ? (
        <div className="relative h-full w-full bg-black flex items-center justify-center animate-in fade-in duration-500">
          {currentAd.video_url ? (
            <video 
              src={currentAd.video_url} 
              autoPlay 
              muted 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img 
              src={currentAd.image_url} 
              alt={currentAd.title} 
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <Info className="h-3.5 w-3.5" />
              Advertisement
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
              {currentAd.title}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mb-8 line-clamp-2 drop-shadow-lg">
              {currentAd.description}
            </p>
            
            <div className="flex items-center gap-4">
              <Link 
                href={currentAd.link_url} 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Learn More
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
             <div className="h-12 w-12 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-primary transition-all duration-1000 ease-linear"
                    style={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * (5 - adTimer)) / 5 }}
                  />
                </svg>
                <span className="text-white font-black text-lg">{adTimer}</span>
             </div>
             <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Trailer plays in...</span>
          </div>

          <button
            onClick={() => setShowAd(false)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10 backdrop-blur-md border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="relative h-full w-full bg-black flex items-center justify-center">
          <video
            src={trailerUrl}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10 backdrop-blur-md border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}
