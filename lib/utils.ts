import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Tier = 'none' | 'starter' | 'plus' | 'premium';

export function getTierAccess(userTier: Tier, movieTier: Tier): boolean {
  const tiers: Tier[] = ['none', 'starter', 'plus', 'premium'];
  return tiers.indexOf(userTier) >= tiers.indexOf(movieTier);
}

export function getQuality(tier: Tier): string {
  switch (tier) {
    case 'premium': return '4K Full HD';
    case 'plus': return '1080p HD';
    case 'starter': return '720p SD';
    default: return '480p';
  }
}
