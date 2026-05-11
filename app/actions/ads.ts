'use server';

import pool from '@/lib/mysql';
import { createAdsTable } from '@/lib/db-init';

export interface Ad {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  link_url: string;
  active: boolean;
}

export async function getActiveAds(): Promise<Ad[]> {
  try {
    const [rows]: any = await pool.query('SELECT * FROM ads WHERE active = TRUE');
    return rows;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

