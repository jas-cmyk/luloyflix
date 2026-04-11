'use server';

const MOVIES = [
  {
    id: 1,
    title: 'The Cosmic Journey',
    description: 'An epic adventure through the stars.',
    thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
    genre: 'Sci-Fi',
    release_year: 2024
  },
  {
    id: 2,
    title: 'Midnight City',
    description: 'A noir thriller set in a neon-lit metropolis.',
    thumbnail_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=600&fit=crop',
    genre: 'Thriller',
    release_year: 2023
  },
  {
    id: 3,
    title: 'Forest of Whispers',
    description: 'A young girl discovers a hidden world.',
    thumbnail_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    genre: 'Fantasy',
    release_year: 2022
  },
  {
    id: 4,
    title: 'The Last Stand',
    description: 'A gripping drama about courage and sacrifice.',
    thumbnail_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=600&fit=crop',
    genre: 'Drama',
    release_year: 2024
  },
];

export async function getMovies() {
  // Now returning static data instead of querying the database
  return MOVIES;
}
