'use client';

import { useState, useEffect } from 'react';
import { Ad, getActiveAds } from '@/app/actions/ads';
import { Tier } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import Link from 'next/link';

interface AdBannerProps {
  userTier: Tier;
}

export default function AdBanner({ userTier }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (userTier === 'none' || userTier === 'starter') {
      getActiveAds().then(setAds);
    }
  }, [userTier]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  if (userTier !== 'none' && userTier !== 'starter') return null;
  if (ads.length === 0) return null;

  const ad = ads[currentAdIndex];

  return (
    <Card className="overflow-hidden border-2 border-primary/10 bg-muted/30 hover:border-primary/20 transition-all duration-500">
      <CardContent className="p-0">
        <Link href={ad.link_url} className="flex flex-col md:flex-row h-full group">
          <div className="md:w-1/3 relative overflow-hidden">
            {ad.video_url ? (
              <video 
                src={ad.video_url} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <img 
                src={ad.image_url} 
                alt={ad.title} 
                className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-center relative">
            <div className="absolute top-2 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Info className="h-3 w-3" />
              <span>Sponsored</span>
            </div>
            
            <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
              {ad.title}
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-muted-foreground line-clamp-2 mb-4">{ad.description}</p>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg">Learn More</span>
              <span className="text-muted-foreground/60 italic">Remove ads with Premium</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
