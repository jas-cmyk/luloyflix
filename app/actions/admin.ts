'use server';

import pool from '@/lib/mysql';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { Tier } from '@/lib/utils';

async function ensureAdmin() {
  const user = await getCurrentUser();
  // Temporary: Disabled check for testing
  /*
  if (!user || !user.is_admin) {
    throw new Error('Unauthorized');
  }
  */
  return user;
}

export async function getAdminStats() {
  await ensureAdmin();
  try {
    const [userCount]: any = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalRevenue]: any = await pool.query('SELECT SUM(amount) as total FROM transactions WHERE type = "subscription"');
    const [adCount]: any = await pool.query('SELECT COUNT(*) as count FROM ads');
    const [unusedCodes]: any = await pool.query('SELECT COUNT(*) as count FROM redeem_codes WHERE is_used = FALSE');

    return {
      users: userCount[0].count,
      revenue: totalRevenue[0].total || 0,
      ads: adCount[0].count,
      unusedCodes: unusedCodes[0].count
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { users: 0, revenue: 0, ads: 0, unusedCodes: 0 };
  }
}

export async function getAllUsers() {
  await ensureAdmin();
  try {
    const [rows]: any = await pool.query('SELECT id, email, subscription_tier, is_admin, created_at FROM users ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function deleteUser(userId: number) {
  const admin = await ensureAdmin();
  if (admin.id === userId) {
    return { success: false, error: 'Cannot delete yourself' };
  }
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function updateUserTier(userId: number, tier: Tier) {
  await ensureAdmin();
  try {
    await pool.query('UPDATE users SET subscription_tier = ? WHERE id = ?', [tier, userId]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update tier' };
  }
}

export async function toggleAdminStatus(userId: number) {
  const admin = await ensureAdmin();
  if (admin.id === userId) {
    return { success: false, error: 'Cannot change your own status' };
  }
  try {
    const [rows]: any = await pool.query('SELECT is_admin FROM users WHERE id = ?', [userId]);
    const currentStatus = rows[0]?.is_admin;
    await pool.query('UPDATE users SET is_admin = ? WHERE id = ?', [!currentStatus, userId]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to toggle admin status' };
  }
}

export async function getAllTransactions() {
  await ensureAdmin();
  try {
    const [rows]: any = await pool.query(`
      SELECT t.*, u.email as user_email 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    return rows;
  } catch (error) {
    return [];
  }
}

export async function getAdminAds() {
  await ensureAdmin();
  try {
    const [rows]: any = await pool.query('SELECT * FROM ads ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    return [];
  }
}

export async function toggleAdStatus(adId: number) {
  await ensureAdmin();
  try {
    const [rows]: any = await pool.query('SELECT active FROM ads WHERE id = ?', [adId]);
    const currentStatus = rows[0]?.active;
    await pool.query('UPDATE ads SET active = ? WHERE id = ?', [!currentStatus, adId]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createAd(formData: FormData) {
  await ensureAdmin();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image_url = formData.get('image_url') as string;
  const video_url = formData.get('video_url') as string;
  const link_url = formData.get('link_url') as string;

  try {
    await pool.query(
      'INSERT INTO ads (title, description, image_url, video_url, link_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, image_url, video_url, link_url]
    );
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create ad' };
  }
}

export async function getAdminRedeemCodes() {
  await ensureAdmin();
  try {
    const [rows]: any = await pool.query(`
      SELECT r.*, u.email as used_by_email 
      FROM redeem_codes r 
      LEFT JOIN users u ON r.used_by = u.id 
      ORDER BY r.created_at DESC
    `);
    return rows;
  } catch (error) {
    return [];
  }
}

export async function generateBulkRedeemCodes(type: string, data: string, count: number) {
  await ensureAdmin();
  try {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      await pool.query('INSERT INTO redeem_codes (code, benefit_type, benefit_data) VALUES (?, ?, ?)', [code, type, data]);
      codes.push(code);
    }
    revalidatePath('/admin');
    return { success: true, codes };
  } catch (error) {
    return { success: false };
  }
}
