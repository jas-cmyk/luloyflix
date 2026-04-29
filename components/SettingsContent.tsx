'use client';

import { useState } from 'react';
import { useLanguage } from "@/lib/contexts";
import { Tier, cn } from "@/lib/utils";
import { updateSubscription } from "@/app/actions/movies";
import { redeemCode } from "@/app/actions/redeem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, User, CreditCard, History, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/app/actions/movies";

interface SettingsContentProps {
  user: any;
  favoriteMovies: any[];
  recentMovies: any[];
  transactions: Transaction[];
}

export default function SettingsContent({ user, favoriteMovies, recentMovies, transactions }: SettingsContentProps) {
  const { t } = useLanguage();
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const tiers: { id: Tier, price: number, features: string[] }[] = [
    { id: 'starter', price: 100, features: ['Watch Movies (Limited)', 'Ads included', 'Standard Quality (720p)'] },
    { id: 'plus', price: 300, features: ['More Movies Unlocked', 'No ads', 'HD Quality (1080p)'] },
    { id: 'premium', price: 700, features: ['All movies unlocked', 'No ads', 'Full HD (4K)', 'Download Option'] },
  ];

  const handleUpdateTier = async (tier: Tier) => {
    setLoadingTier(tier);
    try {
      await updateSubscription(user.id, tier);
    } finally {
      setLoadingTier(null);
    }
  };

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setRedeeming(true);
    setRedeemStatus(null);
    try {
      const res = await redeemCode(user.id, code.trim());
      if (res.success) {
        setRedeemStatus({ type: 'success', message: res.message || t('redeem_success') });
        setCode("");
      } else {
        setRedeemStatus({ type: 'error', message: res.error || t('redeem_error') });
      }
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{t('settings')}</h1>
          <p className="text-muted-foreground">{t('manage_account')}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
           <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{t('subscription')}: {t(user.subscription_tier || 'none')}</p>
                  </div>
                </div>
              </CardContent>
           </Card>
        </aside>

        <div className="space-y-12">
          {/* Tiers Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{t('change_tier')}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.id} className={cn(
                  "relative transition-all duration-300",
                  user.subscription_tier === tier.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                )}>
                  {user.subscription_tier === tier.id && (
                    <div className="absolute -top-3 -right-3 bg-primary text-white p-1 rounded-full shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <CardHeader className="p-4 text-center">
                    <CardTitle className="text-lg capitalize">{t(tier.id)}</CardTitle>
                    <p className="text-2xl font-bold">₱ {tier.price}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs space-y-2">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                    <Button 
                      className="w-full mt-4 h-8 text-xs font-bold" 
                      variant={user.subscription_tier === tier.id ? "secondary" : "default"}
                      disabled={user.subscription_tier === tier.id || !!loadingTier}
                      onClick={() => handleUpdateTier(tier.id)}
                    >
                      {loadingTier === tier.id ? '...' : user.subscription_tier === tier.id ? t('current_tier') : t('select')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* History Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('recent')}</h2>
            {recentMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentMovies.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative">
                      <img src={movie.thumbnail_url} alt={movie.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                    </div>
                    <p className="text-xs font-bold truncate">{movie.title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('no_history')}</p>
            )}
          </section>

          {/* Favorites Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('favorites')}</h2>
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favoriteMovies.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative">
                      <img src={movie.thumbnail_url} alt={movie.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                    </div>
                    <p className="text-xs font-bold truncate">{movie.title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('no_favorites')}</p>
            )}
          </section>

          {/* Redeem Code Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{t('redeem_code')}</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder={t('redeem_placeholder')}
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="uppercase font-mono tracking-widest"
                    />
                  </div>
                  <Button 
                    onClick={handleRedeem} 
                    disabled={redeeming || !code.trim()}
                    className="min-w-[140px]"
                  >
                    {redeeming ? <Loader2 className="h-4 w-4 animate-spin" /> : t('redeem_button')}
                  </Button>
                </div>
                {redeemStatus && (
                  <p className={cn(
                    "mt-4 text-sm font-bold",
                    redeemStatus.type === 'success' ? "text-green-500" : "text-red-500"
                  )}>
                    {redeemStatus.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Transaction History Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <History className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{t('transaction_history')}</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">{t('date')}</th>
                        <th className="px-4 py-3 text-left font-medium">{t('description')}</th>
                        <th className="px-4 py-3 text-right font-medium">{t('amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 font-medium">{tx.description}</td>
                            <td className="px-4 py-3 text-right font-bold">₱ {tx.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic">
                            {t('no_transactions')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
