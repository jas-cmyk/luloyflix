'use server';

import pool from '@/lib/mysql';
import { revalidatePath } from 'next/cache';
import { Tier } from '@/lib/utils';
import { createTransactionsTable } from '@/lib/db-init';

export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  trailer_url: string;
  genre: string;
  release_year: number;
  tier_required: Tier;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: string;
  description: string;
  amount: number;
  created_at: Date;
}

const TIER_PRICES: Record<Tier, number> = {
  'none': 0,
  'starter': 100,
  'plus': 300,
  'premium': 700
};

const MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Twilight',
    description: 'Bella Swan doesn\'t expect much when she moves to the overcast town of Forks, Washington, until she meets the enigmatic Edward Cullen. Drawn into his world of "vegetarian" vampires and supernatural secrets, Bella finds herself in an intense romance that defies the laws of nature.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235428/Twilight_2008_l97ebn.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/q_auto/f_auto/v1776926515/twilight_trailer_w92fzg.mp4',
    genre: 'Romance',
    release_year: 2008,
    tier_required: 'starter'
  },
  {
    id: 2,
    title: 'Fast And Furious 9',
    description: 'Dom Toretto is leading a quiet life off the grid with Letty and his son, little Brian, but they know that danger always lurks just over their peaceful horizon. This time, that threat will force Dom to confront the sins of his past if he’s going to save those he loves most. His crew joins together to stop a world-shattering plot led by the most skilled assassin and high-performance driver they’ve ever encountered: a man who also happens to be Dom’s forsaken brother, Jakob (John Cena). Along the way, old friends are resurrected, old enemies return, and the team is pushed to its limits—stretching from London to Tokyo, Central America to Edinburgh, and even into the reaches of space.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/Fast_and_Furious_ng0xaj.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777445366/Fast_Furious_9_Official_Trailer_Universal_Pictures_HD_-_Universal_Pictures_UK_1080p_h264_zk22oo.mp4',
    genre: 'Action',
    release_year: 2009,
    tier_required: 'starter'
  },
  {
    id: 3,
    title: 'Alice in Borderland',
    description: 'Arisu, a brilliant but unmotivated gamer, finds himself trapped in a hauntingly empty version of Tokyo alongside his best friends. To stay alive, they are forced to participate in brutal games dictated by playing cards.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/kdrama_Alice_in_borderland_adventure_bestkdrama_iefg3q.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777445792/Alice_in_Borderland_Official_Trailer_Netflix_-_Netflix_1080p_h264_fgq8mg.mp4',
    genre: 'Fantasy',
    release_year: 2020,
    tier_required: 'plus'
  },
  {
    id: 4,
    title: 'Evil Dead Rise',
    description: 'Estranged sisters Beth and Ellie are reunited when Beth visits Ellie’s apartment in a condemned Los Angeles building. Their reunion takes a horrific turn when an earthquake unearths a hidden vault.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/All_I_can_say_about_Evil_Dead_Rise_is_I_find_it_wq1cph.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777446215/EVIL_DEAD_RISE_-_Official_Trailer_-_Redband_-_StudiocanalUK_1080p_h264_rrbixw.mp4',
    genre: 'Horror',
    release_year: 2023,
    tier_required: 'premium'
  },
  {
    id: 5,
    title: 'The Nun',
    description: 'A young nun’s mysterious death in a secluded monastery in Romania draws the attention of the Church. A priest and a novice nun are sent to investigate, but what they uncover is a dark and powerful evil.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251053/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NTM._V1__lxtogl.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4',
    genre: 'Horror',
    release_year: 2018,
    tier_required: 'plus'
  },
  {
    id: 6,
    title: 'The Conjuring',
    description: 'Paranormal investigators Ed and Lorraine Warren are called to help a family experiencing disturbing events in their farmhouse. As the activity becomes more intense, they discover a dark presence haunting the home.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251139/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ._V1__v5dvez.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4',
    genre: 'Horror',
    release_year: 2013,
    tier_required: 'starter'
  },
  {
    id: 7,
    title: 'Annabelle',
    description: 'Annabelle is a horror movie about a haunted doll that brings fear and danger to the people who own it. The story follows a couple who receive the doll as a gift, but strange and scary events start happening.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251341/MV5BNjkyMDU5ZWQtZDhkOC00ZWFjLWIyM2MtZWFhMDUzNjdlNzU2XkEyXkFqcGc._V1__mhbbmq.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/mountain_bike.mp4',
    genre: 'Horror',
    release_year: 2014,
    tier_required: 'plus'
  },
  {
    id: 8,
    title: 'Harry Potter and the Sorcerer\'s Stone',
    description: 'Harry Potter and the Sorcerer’s Stone is a fantasy movie about a young boy named Harry Potter who discovers that he is a wizard. He leaves his ordinary life and enters Hogwarts School of Witchcraft and Wizardry.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777250245/fdea56fa-2703-47c1-8da8-70fc5382e1ea_z4kxcg.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/sea_turtle.mp4',
    genre: 'Fantasy',
    release_year: 2001,
    tier_required: 'premium'
  },
  {
    id: 9,
    title: 'Bridge to terabithia',
    description: 'Bridge to Terabithia is a drama fantasy movie about two kids who become best friends and create an imaginary magical world called Terabithia in the forest.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777444764/Bridge_to_Terabithia_wgekdo.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4',
    genre: 'Fantasy',
    release_year: 2007,
    tier_required: 'plus'
  },
  {
    id: 10,
    title: 'A Minecraft movie',
    description: 'A Minecraft Movie is an adventure fantasy movie based on the popular game Minecraft. It follows a group of characters who are transported into a blocky, pixel-style world.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777250866/rs_w_1280_jvzylo.webp',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4',
    genre: 'Fantasy',
    release_year: 2025,
    tier_required: 'starter'
  },
    {
    id: 11,
    title: 'Anime',
    description: 'A Minecraft Movie is an adventure fantasy movie based on the popular game Minecraft. It follows a group of characters who are transported into a blocky, pixel-style world.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777250866/rs_w_1280_jvzylo.webp',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4',
    genre: 'Animation',
    release_year: 2025,
    tier_required: 'starter'
  }
];

export async function getMovies() {
  return MOVIES;
}

export async function getMovieById(id: number) {
  return MOVIES.find((movie) => movie.id === id) ?? null;
}

export async function updateSubscription(userId: number, tier: Tier) {
  try {
    await createTransactionsTable();
    
    // Get current tier to check if it's an upgrade or downgrade
    const [userRows]: any = await pool.query('SELECT subscription_tier FROM users WHERE id = ?', [userId]);
    const currentTier = userRows[0]?.subscription_tier || 'none';

    if (currentTier === tier) {
      return { success: true };
    }

    await pool.query('UPDATE users SET subscription_tier = ? WHERE id = ?', [tier, userId]);
    
    // Record transaction
    const price = TIER_PRICES[tier];
    if (price > 0) {
      await pool.query(
        'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
        [userId, 'subscription', `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`, price]
      );
    }

    revalidatePath('/');
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'Failed to update subscription' }; 
  }
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  try {
    await createTransactionsTable();
    const [rows]: any = await pool.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
