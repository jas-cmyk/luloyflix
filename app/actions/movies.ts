'use server';

const MOVIES = [
  {
    id: 1,
    title: 'Twilight',
    description: 'Bella Swan doesn\'t expect much when she moves to the overcast town of Forks, Washington, until she meets the enigmatic Edward Cullen. Drawn into his world of "vegetarian" vampires and supernatural secrets, Bella finds herself in an intense romance that defies the laws of nature. But when a ruthless nomadic coven targets her, the Cullens must fight to protect her from a tracker who won\'t stop until his hunt is complete.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235428/Twilight_2008_l97ebn.jpg',
    genre: 'Romance',
    release_year: 2008,
    price: 9.99
  },
  {
    id: 2,
    title: 'Fast And Furious',
    description: 'In the heart of Los Angeles\' underground racing scene, undercover LAPD officer Brian O\'Conner (Paul Walker) must earn the trust of the legendary Dominic Toretto (Vin Diesel) to investigate a series of daring truck hijackings. As Brian becomes entrenched in Dom’s adrenaline-fueled world and falls for his sister, Mia, the line between his duty and his newfound loyalty begins to blur. In a world where respect is earned a quarter-mile at a time, Brian must decide where his true allegiance lies before the engines stop and the law catches up.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/Fast_and_Furious_ng0xaj.jpg',
    genre: 'Action',
    release_year: 2009,
    price: 12.99
  },
  {
    id: 3,
    title: 'Alice and Borderland',
    description: 'Arisu, a brilliant but unmotivated gamer, finds himself trapped in a hauntingly empty version of Tokyo alongside his best friends. To stay alive, they are forced to participate in brutal games dictated by playing cards, where the suit determines the challenge: physical, logical, cooperative, or psychological. As the games claim more lives, Arisu teams up with the resilient Usagi to uncover the mystery of the "Borderland" and discover if there is any way to return to the world they once knew.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/kdrama_Alice_in_borderland_adventure_bestkdrama_iefg3q.jpg',
    genre: 'Fantasy',
    release_year: 2020,
    price: 14.99
  },
  {
    id: 4,
    title: 'Evil Dead Rise',
    description: 'Estranged sisters Beth and Ellie are reunited when Beth visits Ellie’s apartment in a condemned Los Angeles building. Their reunion takes a horrific turn when an earthquake unearths a hidden vault, revealing a sinister, flesh-bound book. When Ellie’s teenage son inadvertently summons a demonic force, Ellie is transformed into a terrifying "Deadite." Trapped by a collapsed staircase and a failing elevator, Beth must find the strength to protect her nieces and nephew from a relentless, mocking evil that wears the face of their own mother.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/All_I_can_say_about_Evil_Dead_Rise_is_I_find_it_wq1cph.jpg',
    genre: 'Horror',
    release_year: 2023,
    price: 19.99
  },
];

export async function getMovies() {
  // Now returning static data instead of querying the database
  return MOVIES;
}

export async function getMovieById(id: number) {
  return MOVIES.find((movie) => movie.id === id) ?? null;
}
