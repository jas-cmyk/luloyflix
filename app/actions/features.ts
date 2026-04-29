'use server';

import pool from '@/lib/mysql';
import { revalidatePath } from 'next/cache';
import { createFeaturesTables } from '@/lib/db-init';

export async function toggleFavorite(userId: number, movieId: number) {
  try {
    await createFeaturesTables();
    const [existing]: any = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
    } else {
      await pool.query('INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)', [userId, movieId]);
    }
    revalidatePath(`/movies/${movieId}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Failed to update favorites' };
  }
}

export async function isFavorite(userId: number, movieId: number) {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    return rows.length > 0;
  } catch (error) {
    return false;
  }
}

export async function getFavorites(userId: number) {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query('SELECT movie_id FROM favorites WHERE user_id = ?', [userId]);
    return rows.map((r: any) => r.movie_id);
  } catch (error) {
    return [];
  }
}

export async function trackRecentlyWatched(userId: number, movieId: number) {
  try {
    await createFeaturesTables();
    await pool.query(
      'INSERT INTO recently_watched (user_id, movie_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE watched_at = CURRENT_TIMESTAMP',
      [userId, movieId]
    );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error tracking history:', error);
    return { success: false };
  }
}

export async function getRecentlyWatched(userId: number) {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      'SELECT movie_id FROM recently_watched WHERE user_id = ? ORDER BY watched_at DESC LIMIT 10',
      [userId]
    );
    return rows.map((r: any) => r.movie_id);
  } catch (error) {
    return [];
  }
}

export async function rateMovie(userId: number, movieId: number, rating: number) {
  try {
    await createFeaturesTables();
    await pool.query(
      'INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
      [userId, movieId, rating]
    );
    revalidatePath(`/movies/${movieId}`);
    return { success: true };
  } catch (error) {
    console.error('Error rating movie:', error);
    return { success: false };
  }
}

export async function getMovieRating(movieId: number) {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      'SELECT AVG(rating) as average, COUNT(*) as count FROM ratings WHERE movie_id = ?',
      [movieId]
    );
    return {
      average: parseFloat(rows[0].average) || 0,
      count: rows[0].count || 0
    };
  } catch (error) {
    return { average: 0, count: 0 };
  }
}

export async function getMovieRatings(movieIds: number[]): Promise<Record<number, { average: number, count: number }>> {
  if (!movieIds.length) return {};
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      `SELECT movie_id, AVG(rating) as average, COUNT(*) as count 
       FROM ratings 
       WHERE movie_id IN (?) 
       GROUP BY movie_id`,
      [movieIds]
    );

    const ratings: Record<number, { average: number, count: number }> = {};
    rows.forEach((row: any) => {
      ratings[row.movie_id] = {
        average: parseFloat(row.average) || 0,
        count: row.count || 0
      };
    });
    return ratings;
  } catch (error) {
    console.error('Error fetching bulk ratings:', error);
    return {};
  }
}

export async function getUserRating(userId: number, movieId: number) {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      'SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    return rows[0]?.rating || 0;
  } catch (error) {
    return 0;
  }
}

export async function getMostViewedMovies(limit: number = 10): Promise<{ movie_id: number, views: number }[]> {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      `SELECT movie_id, COUNT(*) as views 
       FROM recently_watched 
       GROUP BY movie_id 
       ORDER BY views DESC 
       LIMIT ?`,
      [limit]
    );
    return rows.map((r: any) => ({ movie_id: r.movie_id, views: r.views }));
  } catch (error) {
    console.error('Error fetching most viewed:', error);
    return [];
  }
}

export async function getMostRatedMovies(limit: number = 10): Promise<{ movie_id: number, average: number, count: number }[]> {
  try {
    await createFeaturesTables();
    const [rows]: any = await pool.query(
      `SELECT movie_id, AVG(rating) as average, COUNT(*) as count 
       FROM ratings 
       GROUP BY movie_id 
       ORDER BY average DESC, count DESC 
       LIMIT ?`,
      [limit]
    );
    return rows.map((r: any) => ({ 
      movie_id: r.movie_id, 
      average: parseFloat(r.average) || 0, 
      count: r.count 
    }));
  } catch (error) {
    console.error('Error fetching most rated:', error);
    return [];
  }
}
