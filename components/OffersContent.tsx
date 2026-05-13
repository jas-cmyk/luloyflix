'use client';

import { useState, useEffect } from 'react';
import { Bundle, buyBundle } from "@/app/actions/movies";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart, CheckCircle, Tag, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OffersContentProps {
  user: any;
  bundles: Bundle[];
}

export default function OffersContent({ user, bundles }: OffersContentProps) {
  const router = useRouter();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (bundleId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setBuyingId(bundleId);
    const res = await buyBundle(user.id, bundleId);
    if (res.success) {
      alert("Bundle purchased successfully!");
      router.refresh();
    } else {
      alert(res.error || "Failed to purchase bundle");
    }
    setBuyingId(null);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {bundles.map((bundle) => {
        const discount = Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100);
        
        return (
          <Card key={bundle.id} className="overflow-hidden border-none shadow-2xl bg-card flex flex-col group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={bundle.thumbnail_url} 
                alt={bundle.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                  {discount}% OFF
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white/90 text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Ends: {new Date(bundle.endsAt).toLocaleDateString()}</span>
              </div>
            </div>

            <CardContent className="p-6 flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-black mb-2 leading-tight">{bundle.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{bundle.description}</p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border/50">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Unlocks {bundle.movieIds.length} Movies Instantly
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">{bundle.price} Credits</span>
                <span className="text-sm text-muted-foreground line-through font-medium">{bundle.originalPrice} Credits</span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button 
                onClick={() => handleBuy(bundle.id)} 
                disabled={buyingId === bundle.id}
                className="w-full h-12 rounded-xl font-black text-base shadow-lg shadow-primary/20"
              >
                {buyingId === bundle.id ? (
                  "Processing..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Bundle
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
