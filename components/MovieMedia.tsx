"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"

interface MovieMediaProps {
  title: string
  thumbnailUrl: string
  trailerUrl: string
  onPlay?: () => void
}

export default function MovieMedia({ title, thumbnailUrl, trailerUrl, onPlay }: MovieMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    if (onPlay) onPlay()
  }

  return (
    <div className="relative overflow-hidden bg-slate-900 aspect-video">
      {!isPlaying ? (
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
