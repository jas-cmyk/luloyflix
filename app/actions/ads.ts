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
    await createAdsTable();
    
    // Seed some sample ads if the table is empty
    const [countRows]: any = await pool.query('SELECT COUNT(*) as count FROM ads');
    if (countRows[0].count === 0) {
      await pool.query(`
        INSERT INTO ads (title, description, image_url, video_url, link_url) VALUES 
        ('Luloyflix Premium', 'Upgrade now for 4K streaming and no ads!', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=1000', 'https://res.cloudinary.com/demo/video/upload/v1/sea_turtle.mp4', '/settings'),
        ('New Action Hits', 'Watch the latest action blockbusters only on Luloyflix.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000', 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4', '/'),
        ('Family Night Special', 'Discover movies the whole family will love.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000', 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4', '/')
      `);
    }

    const [rows]: any = await pool.query('SELECT * FROM ads WHERE active = TRUE');
    return rows;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}
