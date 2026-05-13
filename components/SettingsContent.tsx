'use client';

import { useState } from 'react';
import { useLanguage } from "@/lib/contexts";
import { Tier, cn } from "@/lib/utils";
import { updateSubscription, addCredits } from "@/app/actions/movies";
import { redeemCode } from "@/app/actions/redeem";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, User, CreditCard, History, Ticket, Loader2, Plus, Wallet, ShieldCheck, Landmark } from "lucide-react";
import Link from "next/link";
import { Transaction } from "@/app/actions/movies";

interface SettingsContentProps {
  user: any;
  favoriteMovies: any[];
  recentMovies: any[];
  mostWatchedMovies: any[];
  transactions: Transaction[];
}

export default function SettingsContent({ user, favoriteMovies, recentMovies, mostWatchedMovies, transactions }: SettingsContentProps) {
  const { t } = useLanguage();
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Credit Purchase State
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  
  // Simulated Card State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

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

  const handleAddCredits = async () => {
    setPurchaseError("");
    
    // Validation for realism
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setPurchaseError("Invalid card number (needs 16 digits)");
        return;
      }
      if (!expiry.includes('/') || expiry.length < 5) {
        setPurchaseError("Invalid expiry date (MM/YY)");
        return;
      }
      if (cvv.length < 3) {
        setPurchaseError("Invalid CVV");
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail.includes('@') || !paypalEmail.includes('.')) {
        setPurchaseError("Invalid PayPal email");
        return;
      }
    }

    setIsPurchasing(true);
    try {
      const res = await addCredits(user.id, purchaseAmount, paymentMethod.toUpperCase());
      if (res.success) {
        setShowAddCredits(false);
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setPaypalEmail("");
      } else {
        setPurchaseError(res.error || "Purchase failed");
      }
    } finally {
      setIsPurchasing(false);
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
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-xs text-muted-foreground capitalize">{t('subscription')}: {t(user.subscription_tier || 'none')}</p>
                      <p className="text-sm font-black text-primary">Balance: {user.credits || 0} Credits</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-full gap-2 mt-2"
                    onClick={() => setShowAddCredits(!showAddCredits)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Credits
                  </Button>
                </div>
              </CardContent>
           </Card>

           <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                 <ShieldCheck className="h-4 w-4" />
                 <span className="text-xs font-bold uppercase tracking-wider">Secure Payment</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Your payment information is encrypted and processed securely. We do not store your full card details on our servers.
              </p>
           </div>
        </aside>

        <div className="space-y-12">
          {/* Add Credits Section (Conditional) */}
          {showAddCredits && (
             <section className="animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="flex items-center gap-3 mb-6">
                 <Wallet className="h-6 w-6 text-primary" />
                 <h2 className="text-2xl font-bold">Add Credits</h2>
               </div>
               <Card className="border-primary/30 shadow-2xl shadow-primary/5 overflow-hidden">
                 <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-bold">Secure Checkout</span>
                    <div className="flex gap-2">
                       <div className="h-5 w-8 bg-slate-200 rounded animate-pulse" />
                       <div className="h-5 w-8 bg-slate-200 rounded animate-pulse delay-75" />
                       <div className="h-5 w-8 bg-slate-200 rounded animate-pulse delay-150" />
                    </div>
                 </div>
                 <CardContent className="p-6 space-y-6">
                    {/* Amount Selection */}
                    <div>
                       <label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">Select Amount</label>
                       <div className="grid grid-cols-4 gap-3">
                          {[100, 500, 1000, 2000].map((amt) => (
                             <Button 
                                key={amt}
                                variant={purchaseAmount === amt ? "default" : "outline"}
                                className="rounded-xl font-bold"
                                onClick={() => setPurchaseAmount(amt)}
                             >
                               {amt}
                             </Button>
                          ))}
                       </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                       <label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">Payment Method</label>
                       <div className="grid grid-cols-3 gap-3">
                          <Button 
                             variant={paymentMethod === 'card' ? "secondary" : "ghost"}
                             className={cn("h-16 flex flex-col gap-1 rounded-xl border", paymentMethod === 'card' && "border-primary")}
                             onClick={() => setPaymentMethod('card')}
                          >
                             <CreditCard className="h-5 w-5" />
                             <span className="text-[10px] font-bold">Card</span>
                          </Button>
                          <Button 
                             variant={paymentMethod === 'paypal' ? "secondary" : "ghost"}
                             className={cn("h-16 flex flex-col gap-1 rounded-xl border", paymentMethod === 'paypal' && "border-primary")}
                             onClick={() => setPaymentMethod('paypal')}
                          >
                             <Landmark className="h-5 w-5" />
                             <span className="text-[10px] font-bold">PayPal</span>
                          </Button>
                          <Button 
                             variant={paymentMethod === 'gpay' ? "secondary" : "ghost"}
                             className={cn("h-16 flex flex-col gap-1 rounded-xl border", paymentMethod === 'gpay' && "border-primary")}
                             onClick={() => setPaymentMethod('gpay')}
                          >
                             <div className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">G</div>
                             <span className="text-[10px] font-bold">Google Pay</span>
                          </Button>
                       </div>
                    </div>

                    {/* Dynamic Form Fields */}
                    <div className="space-y-4 pt-2">
                       {paymentMethod === 'card' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                             <Input 
                                placeholder="Card Number (XXXX XXXX XXXX XXXX)" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                                className="rounded-xl font-mono"
                             />
                             <div className="grid grid-cols-2 gap-4">
                                <Input 
                                   placeholder="MM/YY" 
                                   value={expiry}
                                   onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/'))}
                                   className="rounded-xl font-mono"
                                />
                                <Input 
                                   placeholder="CVV" 
                                   type="password"
                                   value={cvv}
                                   onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                   className="rounded-xl font-mono"
                                />
                             </div>
                          </div>
                       )}

                       {paymentMethod === 'paypal' && (
                          <div className="animate-in fade-in duration-200">
                             <Input 
                                type="email"
                                placeholder="PayPal Email Address" 
                                value={paypalEmail}
                                onChange={(e) => setPaypalEmail(e.target.value)}
                                className="rounded-xl"
                             />
                          </div>
                       )}

                       {paymentMethod === 'gpay' && (
                          <div className="p-4 bg-muted/50 rounded-xl text-center space-y-2 animate-in fade-in duration-200">
                             <p className="text-xs text-muted-foreground font-medium">Ready to pay with your Google account</p>
                             <p className="text-[10px] text-muted-foreground/60 italic">Current User: {user.email}</p>
                          </div>
                       )}
                    </div>

                    {purchaseError && (
                       <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900 animate-shake">
                         {purchaseError}
                       </p>
                    )}
                 </CardContent>
                 <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row gap-4">
                    <Button 
                       variant="ghost" 
                       className="rounded-xl order-2 sm:order-1" 
                       onClick={() => setShowAddCredits(false)}
                       disabled={isPurchasing}
                    >
                       Cancel
                    </Button>
                    <Button 
                       className="flex-1 rounded-xl h-12 font-black text-lg order-1 sm:order-2"
                       onClick={handleAddCredits}
                       disabled={isPurchasing}
                    >
                       {isPurchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : `Complete Purchase - ${purchaseAmount} Credits`}
                    </Button>
                 </CardFooter>
               </Card>
             </section>
          )}

          {/* Tiers Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Subscription Benefits</h2>
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
                    {tier.id === 'starter' && (
                      <>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>Standard Quality (720p)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>Ads included</span>
                        </div>
                      </>
                    )}
                    {tier.id === 'plus' && (
                      <>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>HD Quality (1080p)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>No ads</span>
                        </div>
                      </>
                    )}
                    {tier.id === 'premium' && (
                      <>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>4K Ultra HD</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>No ads</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>Download Option</span>
                        </div>
                      </>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2 italic">* Movies purchased separately</p>
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

          {/* Most Watched Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('most_watched')}</h2>
            {mostWatchedMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mostWatchedMovies.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative">
                      <img src={movie.thumbnail_url} alt={movie.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                    </div>
                    <p className="text-xs font-bold truncate">{movie.title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('no_most_watched')}</p>
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
                            <td className="px-4 py-3 text-right font-bold">
                              {tx.type === 'subscription' ? `₱ ${tx.amount}` : `${tx.amount > 0 ? '+' : ''}${tx.amount} Credits`}
                            </td>
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
