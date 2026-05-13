'use server';

import pool from '@/lib/mysql';
import { revalidatePath } from 'next/cache';
import { Tier } from '@/lib/utils';
import { createTransactionsTable, createPurchasesTable } from '@/lib/db-init';

export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  trailer_url: string;
  genres: string[];
  release_year: number;
  tier_required: Tier;
  price: number;
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
    genres: ['Romance'],
    release_year: 2008,
    tier_required: 'starter',
    price: 249
  },
  {
    id: 2,
    title: 'Fast And Furious 9',
    description: 'Dom Toretto is leading a quiet life off the grid with Letty and his son, little Brian, but they know that danger always lurks just over their peaceful horizon. This time, that threat will force Dom to confront the sins of his past if he’s going to save those he loves most. His crew joins together to stop a world-shattering plot led by the most skilled assassin and high-performance driver they’ve ever encountered: a man who also happens to be Dom’s forsaken brother, Jakob (John Cena). Along the way, old friends are resurrected, old enemies return, and the team is pushed to its limits—stretching from London to Tokyo, Central America to Edinburgh, and even into the reaches of space.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/Fast_and_Furious_ng0xaj.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777445366/Fast_Furious_9_Official_Trailer_Universal_Pictures_HD_-_Universal_Pictures_UK_1080p_h264_zk22oo.mp4',
    genres: ['Action'],
    release_year: 2009,
    tier_required: 'starter',
    price: 149
  },
  {
    id: 3,
    title: 'Alice in Borderland',
    description: 'Arisu, a brilliant but unmotivated gamer, finds himself trapped in a hauntingly empty version of Tokyo alongside his best friends. To stay alive, they are forced to participate in brutal games dictated by playing cards.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/kdrama_Alice_in_borderland_adventure_bestkdrama_iefg3q.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777445792/Alice_in_Borderland_Official_Trailer_Netflix_-_Netflix_1080p_h264_fgq8mg.mp4',
    genres: ['Sci-fi', 'Thriller'],
    release_year: 2020,
    tier_required: 'plus',
    price: 499
  },
  {
    id: 4,
    title: 'Evil Dead Rise',
    description: 'Estranged sisters Beth and Ellie are reunited when Beth visits Ellie’s apartment in a condemned Los Angeles building. Their reunion takes a horrific turn when an earthquake unearths a hidden vault.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1776235426/All_I_can_say_about_Evil_Dead_Rise_is_I_find_it_wq1cph.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1777446215/EVIL_DEAD_RISE_-_Official_Trailer_-_Redband_-_StudiocanalUK_1080p_h264_rrbixw.mp4',
    genres: ['Horror'],
    release_year: 2023,
    tier_required: 'premium',
    price: 149
  },
  {
    id: 5,
    title: 'The Nun',
    description: 'A young nun’s mysterious death in a secluded monastery in Romania draws the attention of the Church. A priest and a novice nun are sent to investigate, but what they uncover is a dark and powerful evil.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251053/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NTM._V1__lxtogl.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4',
    genres: ['Horror', 'Mystery'],
    release_year: 2018,
    tier_required: 'plus',
    price: 99
  },
  {
    id: 6,
    title: 'The Conjuring',
    description: 'Paranormal investigators Ed and Lorraine Warren are called to help a family experiencing disturbing events in their farmhouse. As the activity becomes more intense, they discover a dark presence haunting the home.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251139/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ._V1__v5dvez.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4',
    genres: ['Horror'],
    release_year: 2013,
    tier_required: 'starter',
    price: 199
  },
  {
    id: 7,
    title: 'Annabelle',
    description: 'Annabelle is a horror movie about a haunted doll that brings fear and danger to the people who own it. The story follows a couple who receive the doll as a gift, but strange and scary events start happening.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777251341/MV5BNjkyMDU5ZWQtZDhkOC00ZWFjLWIyM2MtZWFhMDUzNjdlNzU2XkEyXkFqcGc._V1__mhbbmq.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/mountain_bike.mp4',
    genres: ['Horror'],
    release_year: 2014,
    tier_required: 'plus',
    price: 199
  },
  {
    id: 8,
    title: 'Harry Potter and the Sorcerer\'s Stone',
    description: 'Harry Potter and the Sorcerer’s Stone is a fantasy movie about a young boy named Harry Potter who discovers that he is a wizard. He leaves his ordinary life and enters Hogwarts School of Witchcraft and Wizardry.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777250245/fdea56fa-2703-47c1-8da8-70fc5382e1ea_z4kxcg.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/sea_turtle.mp4',
    genres: ['Fantasy'],
    release_year: 2001,
    tier_required: 'premium',
    price: 149
  },
  {
    id: 9,
    title: 'Bridge to terabithia',
    description: 'Bridge to Terabithia is a drama fantasy movie about two kids who become best friends and create an imaginary magical world called Terabithia in the forest.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777444764/Bridge_to_Terabithia_wgekdo.jpg',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4',
    genres: ['Fantasy'],
    release_year: 2007,
    tier_required: 'plus',
    price: 200
  },
  {
    id: 10,
    title: 'A Minecraft movie',
    description: 'A Minecraft Movie is an adventure fantasy movie based on the popular game Minecraft. It follows a group of characters who are transported into a blocky, pixel-style world.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1777250866/rs_w_1280_jvzylo.webp',
    trailer_url: 'https://res.cloudinary.com/demo/video/upload/v1/elephants.mp4',
    genres: ['Fantasy'],
    release_year: 2025,
    tier_required: 'starter',
    price: 99
  },
  {
    id: 11,
    title: 'The Angry Birds Movie',
    description: 'On an island populated entirely by happy, flightless birds, Red—a bird with a massive temper problem—has always been the odd one out. While the rest of the community spends their days in a state of blissful, naive harmony, Red is stuck in court-ordered anger management classes alongside the hyperactive Chuck and the volatile Bomb.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778154356/The_Angry_Birds_Movie_om3zok.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778154810/YTDown_YouTube_THE-ANGRY-BIRDS-MOVIE-Official-Theatrica_Media_QRmKa7vvct4_001_1080p_pnqftz.mp4',
    genres: ['Animation'],
    release_year: 2016,
    tier_required: 'starter',
    price: 159
  },
  {
    id: 12,
    title: 'The Angry Birds Movie 2',
    description: 'The ongoing prank war between Bird Island and Piggy Island is cut short when giant ice balls begin raining down from the sky. A new threat has emerged from a mysterious third island—Eagle Island—led by the bitter and brilliant Zeta. Tired of her frozen wasteland, Zeta plans to seize both Bird and Pig Islands for herself, turning them into her own tropical paradise by freezing the inhabitants out.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778155167/Watch_The_Angry_Birds_Movie_2_Full_Movie_HD_facts_Online_zcudx5.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2019,
    tier_required: 'plus',
    price: 199
  },
  {
    id: 13,
    title: 'Shrek',
    description: 'Shrek is a reclusive, territorial ogre who loves the solitude of his swamp. His peace is shattered when the vertically challenged Lord Farquaad evicts every fairy tale creature in the kingdom—from Pinocchio to the Three Little Pigs—straight into Shreks backyard.To get his swamp back, Shrek strikes a deal with Farquaad: he must rescue the beautiful Princess Fiona from a fire-breathing dragon and bring her back to be the Lord’s bride.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778155538/Shrek_2001_wlx5zm.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2001,
    tier_required: 'starter',
    price: 159
  },
  {
    id: 14,
    title: 'The Lorax',
    description: 'The story is set in Thneedville, a walled-off city where "nature" is powered by batteries and the grass is made of silicone. Twelve-year-old Ted is willing to do anything to win the heart of his crush, Audrey, who dreams of seeing a real, living tree. Following the cryptic advice of his grandmother, Ted sneaks outside the city walls to find the Once-ler—a mysterious hermit living in a desolate wasteland—who holds the secret of what happened to the trees.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778156381/Dr__Seuss_The_Lorax_2012_fueclf.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2012,
    tier_required: 'premium',
    price: 99
  },
  {
    id: 15,
    title: 'Trolls',
    description: 'The Trolls are the happiest creatures to ever exist. They live in a constant cycle of singing, dancing, and hourly "hug times." Their leader, Poppy, is the most optimistic of them all, believing that life is just one big party. However, their joy is threatened by the Bergens—miserable, giant creatures who believe the only way to feel happy is to eat a Troll.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778156821/download_edinxm.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2016,
    tier_required: 'plus',
    price: 99
  },
  {
    id: 16,
    title: 'Transformers',
    description: 'The story follows Sam Witwicky, an ordinary teenager who just wants a car and a chance with his crush, Mikaela Banes. His life changes forever when the beat-up 1976 Camaro he buys turns out to be Bumblebee, an advanced alien scout. Sam discovers he holds the key to finding the AllSpark—an ancient artifact capable of creating life—which has been hidden on Earth for centuries. This puts him directly in the crosshairs of a civil war between two robotic factions from the planet Cybertron.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778157211/TRANSFORMERS_2007_woq09m.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778157560/YTDown_YouTube_TRANSFORMERS-2007-Movie-Clip-Mikaela-Che_Media_5mJIUdS6juA_001_720p_wsbrkt.mp4',
    genres: ['Action'],
    release_year: 2007,
    tier_required: 'starter',
    price: 299
  },
  {
    id: 17,
    title: 'The Notebook',
    description: 'The story is told as a narrative within a narrative. In the modern day, an elderly man named Duke reads from a weathered notebook to a fellow nursing home resident who suffers from dementia. He tells her the story of two young lovers in the 1940s.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778157777/The_Notebook_s4kuad.jpg',
    trailer_url: '',
    genres: ['Romance'],
    release_year: 2004,
    tier_required: 'plus',
    price: 169
  },
  {
    id: 18,
    title: 'Titanic',
    description: 'James Camerons Titanic (1997) is a cinematic colossus that blends historical tragedy with a fictional "star-crossed lovers" narrative. It remains one of the highest-grossing films of all time, famous for its technical ambition and its heartbreaking portrayal of the "unsinkable" ships final hours.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778158059/download_1_vngsur.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778565108/YTDown_YouTube_Titanic-TBT-Trailer-20th-Century-FOX_Media_CHekzSiZjrY_001_1080p_spybia.mp4',
    genres: ['Romance'],
    release_year: 1997,
    tier_required: 'premium',
    price: 299
  },
  {
    id: 19,
    title: 'IT',
    description: 'In the small town of Derry, Maine, children have been disappearing at an alarming rate. The story begins with the tragic disappearance of young Georgie Denbrough during a rainstorm—a disappearance involving a paper boat, a storm drain, and a haunting pair of yellow eyes. A year later, Georgies older brother Bill and his group of misfit friends—self-dubbed "The Losers Club"—discover they are all being stalked by the same entity. This shape-shifting predator, which they call "IT," primarily appears as Pennywise the Dancing Clown, a nightmare-inducing figure that feeds on the specific fears of its victims.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778158705/It__Special_Edition_2017_-_It__Special_Edition_2017_-_DVD_kn3ot2.jpg',
    trailer_url: '',
    genres: ['Horror'],
    release_year: 2017,
    tier_required: 'premium',
    price: 199
  },
  {
    id: 20,
    title: 'Swapped',
    description: 'A tiny woodland creature and a majestic bird suddenly swap bodies, forcing them to team up to survive the wildest adventure of their lives.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778489773/Swapped_-_Getauscht_2026_yflphk.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2025,
    tier_required: 'starter',
    price: 199
  },
  {
    id: 21,
    title: 'The Secret Life of Pets',
    description: 'The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778490363/Pets_A_Vida_Secreta_dos_Nossos_Bichos_-_2016_liwztn.jpg',
    trailer_url: '',
    genres: ['Animation'],
    release_year: 2016,
    tier_required: 'starter',
    price: 99
  },
  {
    id: 22,
    title: 'Train to Busan',
    description: 'While a zombie virus breaks out in South Korea, passengers struggle to survive on the train from Seoul to Busan.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778490736/TRAIN_TO_BUSAN_2016_cljxao.jpg',
    trailer_url: '',
    genres: ['Horror'],
    release_year: 2016,
    tier_required: 'starter',
    price: 149
  },
  {
    id: 23,
    title: 'Once We Were Us ',
    description: 'Two former lovers cross paths on a flight to Korea, stirring memories of their chance meeting in 2008, when they found love amid Seoul\'s chaos before life pulled them apart.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778491119/Once_We_Were_Us_hn5slw.jpg',
    trailer_url: '',
    genres: ['Romance'],
    release_year: 2025,
    tier_required: 'premium',
    price: 129
  },
  {
    id: 24,
    title: 'Strong Girl Bong-soon',
    description: 'Do Bong-soon is a woman born with superhuman strength that comes from the long line of women possessing it. when Ahn Min Hyuk, the CEO of ainsoft, a gaming company witnesses her strength he hires her as his personal bodyguard.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778491445/download_2_corxrb.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778561707/YTDown_YouTube_Strong-Woman-Do-Bong-Soon-Trailer-Watch-_Media_ysJzkl-SU1Q_001_1080p_qh4x06.mp4',
    genres: ['Romance','Comedy','Action','Thriller','Fantasy'],
    release_year: 2016,
    tier_required: 'premium',
    price: 149
  },
  {
    id: 25,
    title: 'Hitman: Agent Jun',
    description: 'While heavily drunk, an unsuccessful comic book writer draws a comic about his life as a former NIS hitman, and runs into trouble when it gets posted online',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778492043/Hitman__Agent_Jun_y87ino.jpg',
    trailer_url: '',
    genres: ['Action'],
    release_year: 2019,
    tier_required: 'premium',
    price: 149
  },
  {
    id: 26,
    title: 'Taken',
    description: 'A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778492294/Taken_qltaqt.jpg',
    trailer_url: '',
    genres: ['Action'],
    release_year: 2009,
    tier_required: 'premium',
    price: 129
  },
  {
    id: 27,
    title: 'The Last Witch Hunter',
    description: 'The last witch hunter is all that stands between humanity and the combined forces of the most horrifying witches in history.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778492590/download_3_jc0knx.jpg',
    trailer_url: '',
    genres: ['Action'],
    release_year: 2015,
    tier_required: 'premium',
    price: 209
  },
  {
    id: 28,
    title: 'Hellboy',
    description: 'A demon raised from infancy after being conjured by and rescued from the Nazis, grows up to become a defender against the forces of darkness.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778492858/Love_the_Hellboy_films_a6j6im.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778561057/YTDown_YouTube_The-Hows-Of-Us-Official-Trailer-Kathryn-_Media_9C5w28q6JgA_001_1080p_v9r6ez.mp4',
    genres: ['Action'],
    release_year: 2004,
    tier_required: 'premium',
    price: 119
  },
  {
    id: 29,
    title: 'The Hows of Us',
    description: 'A young couple dreams of growing old together as they as they deal with the struggles of being in a long-term relationship',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778562843/The_Hows_of_Us_2018_fwx7hd.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778561057/YTDown_YouTube_The-Hows-Of-Us-Official-Trailer-Kathryn-_Media_9C5w28q6JgA_001_1080p_v9r6ez.mp4',
    genres: ['Romance'],
    release_year: 2018,
    tier_required: 'premium',
    price: 169
  },
  {
    id: 30,
    title: 'Hellboy (2019)',
    description: 'Hellboy comes to England, where he must defeat Nimue, Merlin\'s consort and the Blood Queen. But their battle will bring about the end of the world, a fate he desperately tries to turn away.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778567241/Hellboy_2019_vosa9y.jpg',
    trailer_url: '',
    genres: ['Action'],
    release_year: 2019,
    tier_required: 'premium',
    price: 129
  },
  {
    id: 31,
    title: 'Harry Potter and the Chamber of Secrets',
    description: 'Cars fly, trees fight back, and a mysterious house-elf comes to warn Harry Potter at the start of his second year at Hogwarts. Adventure and danger await when bloody writing on a wall announces: The Chamber Of Secrets Has Been Opened. To save Hogwarts will require all of Harry, Ron and Hermione\'s magical abilities and courage.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778566932/Harry_Potter_and_the_Chamber_of_Secrets_ni8bfu.jpg',
    trailer_url: 'https://res.cloudinary.com/dutvfefbe/video/upload/v1778567154/YTDown_YouTube_Harry-Potter-and-the-Chamber-of-Secrets-_Media_nE11U5iBnH0_001_1080p_1_vna8b2.mp4',
    genres: ['Fantasy'],
    release_year: 2002,
    tier_required: 'premium',
    price: 219
  },
  {
    id: 32,
    title: 'Hello, Love, Goodbye',
    description: 'Joy (Kathryn Bernardo) and Ethan (Alden Richards) are two OFWs in Hong Kong who find themselves falling in love, but their individual plans hinder their budding relationship.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778563531/Hello_Love_Goodbye_%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5_._quyqqk.jpg',
    trailer_url: '',
    genres: ['Romance'],
    release_year: 2019,
    tier_required: 'premium',
    price: 159
  },
  {
    id: 33,
    title: 'Hello, Love, Goodbye again',
    description: 'After fighting for their love to conquer the time, distance and a global shutdown that kept them apart, Joy and Ethan meet again in Canada but realize that they have also changed a lot, individually.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778567521/Kathryn_Bernardo_kathrynbernardo_kathden_actress_bqfhyt.jpg',
    trailer_url: '',
    genres: ['Romance'],
    release_year: 2024,
    tier_required: 'premium',
    price: 169
  },
  {
    id: 34,
    title: 'Just the Way You Are',
    description: 'A popular boy makes a bet with his best friend to make a nerdy girl fall in love with him in 30 days. But as he gets to know her, he finds himself falling for her for real.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778564164/download_4_jxo63j.jpg',
    trailer_url: '',
    genres: ['Romance'],
    release_year: 2015,
    tier_required: 'premium',
    price: 139
  },
  {
    id: 35,
    title: 'Dune: Part One',
    description: 'A popular boy makes a bet with his best friend to make a nerdy girl fall in love with him in 30 days. But as he gets to know her, he finds himself falling for her for real.',
    thumbnail_url: 'https://res.cloudinary.com/dutvfefbe/image/upload/v1778659462/download_5_qweynj.jpg',
    trailer_url: '',
    genres: ['Sci-fi', 'Adventure'],
    release_year: 2015,
    tier_required: 'premium',
    price: 139
  }
];

export interface Bundle {
  id: string;
  title: string;
  description: string;
  movieIds: number[];
  price: number;
  originalPrice: number;
  thumbnail_url: string;
  endsAt: Date;
}

const BUNDLES: Bundle[] = [
  {
    id: 'horror-essentials',
    title: 'Horror Essentials Pack',
    description: 'The ultimate collection for horror fans. Includes The Conjuring, Annabelle, and IT.',
    movieIds: [6, 5, 19],
    price: 149,
    originalPrice: 247,
    thumbnail_url: MOVIES[6-1].thumbnail_url,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    id: 'action-blockbusters',
    title: 'Action Blockbuster Bundle',
    description: 'High-octane excitement with Fast and Furious 9 and Transformers.',
    movieIds: [2, 16],
    price: 79,
    originalPrice: 98,
    thumbnail_url: MOVIES[2-1].thumbnail_url,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    id: 'fantasy-magic',
    title: 'Magical Worlds Collection',
    description: 'Journey to other realms with Harry Potter and Alice in Borderland.',
    movieIds: [8, 3], 
    price: 199,
    originalPrice: 248,
    thumbnail_url: MOVIES[8-1].thumbnail_url,
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  }
];

export async function getBundles() {
  return BUNDLES;
}

export async function buyBundle(userId: number, bundleId: string) {
  try {
    await createTransactionsTable();
    await createPurchasesTable();

    const bundle = BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return { success: false, error: 'Bundle not found' };

    // Check user credits
    const [userRows]: any = await pool.query('SELECT credits FROM users WHERE id = ?', [userId]);
    const userCredits = userRows[0]?.credits || 0;

    if (userCredits < bundle.price) {
      return { success: false, error: `Insufficient credits. You need ${bundle.price - userCredits} more.` };
    }

    // Deduct credits
    await pool.query('UPDATE users SET credits = credits - ? WHERE id = ?', [bundle.price, userId]);

    // Record each movie purchase in the bundle
    for (const movieId of bundle.movieIds) {
      // Check if already purchased to avoid unique key error
      const [existing]: any = await pool.query(
        'SELECT id FROM purchases WHERE user_id = ? AND movie_id = ?',
        [userId, movieId]
      );
      
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO purchases (user_id, movie_id, price) VALUES (?, ?, ?)',
          [userId, movieId, 0] // 0 price because it's part of a bundle
        );
      }
    }

    // Record transaction
    await pool.query(
      'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
      [userId, 'purchase', `Purchased Bundle: ${bundle.title}`, -bundle.price]
    );

    revalidatePath('/');
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Error buying bundle:', error);
    return { success: false, error: 'Failed to buy bundle' };
  }
}

export async function getMovies() {
  return MOVIES;
}

export async function getMovieById(id: number) {
  return MOVIES.find((movie) => movie.id === id) ?? null;
}

export async function buyMovie(userId: number, movieId: number) {
  try {
    await createTransactionsTable();
    await createPurchasesTable();

    const movie = await getMovieById(movieId);
    if (!movie) return { success: false, error: 'Movie not found' };

    // Check if already purchased
    const [existing]: any = await pool.query(
      'SELECT id FROM purchases WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    if (existing.length > 0) return { success: false, error: 'Movie already purchased' };

    // Check user credits
    const [userRows]: any = await pool.query('SELECT credits FROM users WHERE id = ?', [userId]);
    const userCredits = userRows[0]?.credits || 0;

    if (userCredits < movie.price) {
      return { success: false, error: `Insufficient credits. You need ${movie.price - userCredits} more credits.` };
    }

    // Deduct credits
    await pool.query('UPDATE users SET credits = credits - ? WHERE id = ?', [movie.price, userId]);

    // Record purchase
    await pool.query(
      'INSERT INTO purchases (user_id, movie_id, price) VALUES (?, ?, ?)',
      [userId, movieId, movie.price]
    );

    // Record transaction
    await pool.query(
      'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
      [userId, 'purchase', `Purchased movie: ${movie.title}`, -movie.price]
    );

    revalidatePath(`/movies/${movieId}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error buying movie:', error);
    return { success: false, error: 'Failed to buy movie' };
  }
}

export async function hasPurchased(userId: number, movieId: number): Promise<boolean> {
  try {
    const [rows]: any = await pool.query(
      'SELECT id FROM purchases WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking purchase:', error);
    return false;
  }
}

export async function getUserPurchases(userId: number): Promise<number[]> {
  try {
    const [rows]: any = await pool.query(
      'SELECT movie_id FROM purchases WHERE user_id = ?',
      [userId]
    );
    return rows.map((r: any) => r.movie_id);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }
}

export async function addCredits(userId: number, amount: number, paymentMethod: string) {
  try {
    await createTransactionsTable();
    
    // Update user credits
    await pool.query('UPDATE users SET credits = credits + ? WHERE id = ?', [amount, userId]);

    // Record transaction
    await pool.query(
      'INSERT INTO transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)',
      [userId, 'deposit', `Added credits via ${paymentMethod}`, amount]
    );

    revalidatePath('/settings');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding credits:', error);
    return { success: false, error: 'Failed to add credits' };
  }
}

export async function updateSubscription(userId: number, tier: Tier) {
  try {
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
