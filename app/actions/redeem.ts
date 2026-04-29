'use server';

import pool from '@/lib/mysql';
import { revalidatePath } from 'next/cache';
import { Tier } from '@/lib/utils';
import { createRedeemCodesTable, createTransactionsTable, createPurchasesTable } from '@/lib/db-init';
import { getMovieById } from './movies';

export type BenefitType = 'tier' | 'movie' | 'credit';

export async function redeemCode(userId: number, code: string) {
  try {
    await createRedeemCodesTable();
    await createTransactionsTable();
    await createPurchasesTable();

    const [rows]: any = await pool.query(
      'SELECT * FROM redeem_codes WHERE code = ? AND is_used = FALSE',
      [code]
    );

    if (rows.length === 0) {
      return { success: false, error: 'Invalid or already used code' };
    }

    const redeemData = rows[0];
    const benefitType = redeemData.benefit_type as BenefitType;
    const benefitValue = redeemData.benefit_data;

    let successMessage = "";

    if (benefitType === 'tier') {
      const tier = benefitValue as Tier;
      await pool.query('UPDATE users SET subscription_tier = ? WHERE id = ?', [tier, userId]);
      successMessage = `Unlocked ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier!`;
      
      await pool.query(
        'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
        [userId, 'redeem', `Redeemed code for ${tier} Tier`, 0]
      );
    } else if (benefitType === 'movie') {
      const movieId = parseInt(benefitValue);
      const movie = await getMovieById(movieId);
      
      // Check if already purchased
      const [existing]: any = await pool.query('SELECT id FROM purchases WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
      if (existing.length > 0) {
        return { success: false, error: 'You already own this movie' };
      }

      await pool.query(
        'INSERT INTO purchases (user_id, movie_id, price) VALUES (?, ?, ?)',
        [userId, movieId, 0]
      );
      
      successMessage = `Unlocked movie: ${movie?.title || 'Unknown Movie'}!`;
      
      await pool.query(
        'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
        [userId, 'redeem', `Redeemed code for movie: ${movie?.title || 'Unknown'}`, 0]
      );
    }

    // Mark code as used
    await pool.query(
      'UPDATE redeem_codes SET is_used = TRUE, used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId, redeemData.id]
    );

    revalidatePath('/settings');
    revalidatePath('/');
    
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Redeem code error:', error);
    return { success: false, error: 'Failed to redeem code' };
  }
}

export async function generateRedeemCode(type: BenefitType, data: string, count: number = 1) {
  try {
    await createRedeemCodesTable();
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await pool.query('INSERT INTO redeem_codes (code, benefit_type, benefit_data) VALUES (?, ?, ?)', [code, type, data]);
      codes.push(code);
    }
    return { success: true, codes };
  } catch (error) {
    console.error('Generate code error:', error);
    return { success: false };
  }
}
