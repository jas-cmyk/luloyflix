# LuloyFlix - PROJECT SYSTEM FOR IS123

## What is LuloyFlix?

**LuloyFlix** is a movie streaming website. People can sign up, log in, watch movies, and subscribe to different membership levels. There's also an admin area where managers can control ads and features.

## Tools Used to Build It

### What Users See (Frontend)
- **Next.js** - Framework that builds the website
- **TypeScript** - Programming language (helps catch mistakes)
- **Tailwind CSS** - Tool for making things look pretty
- **Radix UI & shadcn/ui** - Pre-made buttons, forms, cards
- **Lucide React** - Pretty icons

### Behind the Scenes (Backend)
- **Node.js** - Runs the server
- **MySQL** - Database that stores all the data
- **Password Hashing** - Safely stores passwords (bcryptjs)
- **Security Tokens** - Keeps users logged in safely (Jose)

### Tools for Building
- **ESLint** - Checks for code mistakes
- **TypeScript** - Catches programming errors
- **Tailwind CSS** - Handles styling

## Project Structure

```
luloyflix/
├── app/                          # All the pages
│   ├── layout.tsx               # Main layout (menu, theme)
│   ├── page.tsx                 # Home page
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Sign up page
│   ├── movies/[id]/page.tsx     # Individual movie page
│   ├── genre/[name]/page.tsx    # Movies by category
│   ├── admin/page.tsx           # Admin control panel
│   ├── offers/page.tsx          # Special offers
│   ├── most-viewed/page.tsx     # Popular movies
│   ├── most-rated/page.tsx      # Best rated movies
│   ├── settings/page.tsx        # User settings
│   ├── actions/                 # Business logic
│   │   ├── auth.ts             # Login/signup logic
│   │   ├── movies.ts           # Movie data
│   │   ├── ads.ts              # Advertisement control
│   │   ├── admin.ts            # Admin tasks
│   │   ├── features.ts         # Feature flags
│   │   └── redeem.ts           # Promo codes
│   ├── api/                     # API endpoints
│   │   └── test-db/route.ts    # Test database
│   └── globals.css              # Site-wide styling

├── components/                   # Reusable pieces
│   ├── Navbar.tsx              # Top menu bar
│   ├── Sidebar.tsx              # Side menu
│   ├── MovieCard.tsx            # Movie preview box
│   ├── MovieDetailContent.tsx   # Movie info page
│   ├── MovieMedia.tsx           # Video player
│   ├── WatchButton.tsx          # Watch button
│   ├── Rating.tsx               # Star ratings
│   ├── FeaturedSlider.tsx       # Carousel of movies
│   ├── AdBanner.tsx             # Ads
│   ├── LoginForm.tsx            # Login box
│   ├── SignUpForm.tsx           # Sign up box
│   ├── SettingsContent.tsx      # Settings page
│   ├── HomeContent.tsx          # Home page content
│   ├── AdminContent.tsx         # Admin dashboard
│   └── ui/                      # Basic elements
│       ├── button.tsx           # Buttons
│       ├── card.tsx             # Cards/boxes
│       ├── input.tsx            # Text inputs
│       └── navigation-menu.tsx  # Menus

├── lib/                         # Helper functions
│   ├── mysql.ts                # Database connection
│   ├── db-init.ts              # Set up database
│   ├── session.ts              # Remember logged-in users
│   ├── auth.ts                 # Authentication helpers
│   ├── contexts.tsx            # Dark mode, language
│   └── utils.ts                # Useful functions

├── public/                      # Images, fonts, etc.
├── package.json                 # What libraries to install
└── Configuration files          # Settings for build tools
```

## What Can You Do?

### 1. Sign Up & Log In
- Create an account with email
- Safely log in with password
- Stay logged in automatically
- View your profile

### 2. Browse Movies
- Look through all movies
- Filter by category
- See most popular movies
- See best-rated movies
- Read movie details

### 3. Manage Subscription
- Choose a membership level
- Get a credits balance
- Use promo codes for rewards

### 4. See Ads
- Ads show on the site
- Admins can turn ads on/off

### 5. Admin Features (for managers)
- Manage users
- Turn features on/off
- Create offers/promotions
- Control advertisements

### 6. User Preferences
- Switch between light and dark mode
- Choose your language
- Works on phone and computer

## Where the Data Lives

The database stores everything in tables:

- **users**: User accounts (email, password, membership level, credits)
- **purchases**: What movies people bought
- **transactions**: Credit history
- **ads**: Advertisement records
- **redeem_codes**: Promo codes for rewards
- **features**: What features are turned on/off

## What You Need to Set Up

Create a `.env.local` file with:

```
# Database info
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=luloyflix

# Or simple connection string
DATABASE_URL=mysql://user:password@host:port/database

# Secret key for security
JWT_SECRET=your-secret-key

# Environment
NODE_ENV=development
```

## How to Get Started

### Step 1: Get the Code
```bash
git clone https://github.com/jas-cmyk/luloyflix.git
cd luloyflix
```

### Step 2: Install Libraries
```bash
npm install
```

### Step 3: Add Settings
- Create `.env.local` file
- Add your database info and secret key

### Step 4: Start the Website
```bash
npm run dev
```

Go to `http://localhost:3000` to see it working

### Step 5: Build for Real Use
```bash
npm run build
npm start
```

### Step 6: Check for Mistakes
```bash
npm run lint
```

## How Login Works

1. User enters email and password
2. Website checks if password is correct
3. Creates a security token
4. Saves token in browser cookies (remembers the user)
5. Next time, we use the token to know it's them
6. When they log out, token is removed

## Dark Mode & Languages

The app remembers your preferences using **Contexts**:
- **Dark/Light Mode**: Choose your preferred theme
- **Language**: Select your language

These are shared with all pages automatically.

## API Endpoints

### Test Database
- **URL**: `/api/test-db`
- **What it does**: Checks if database is working

## Launch the Website

The site is set up to launch on **Vercel** (a hosting service):

- Automatically builds and launches when you push code to GitHub
- Adds environment settings through Vercel's dashboard
- Supports security features for databases

## Speed & Performance

- Database can handle up to 5 people at once
- Unused connections close after 30 seconds
- Prevents too many connections error
- Website shows on desktop and mobile

## Safety & Security

- **Passwords**: Never stored as plain text, use encryption
- **Login**: Uses security tokens that expire
- **Database**: Can use encryption when uploading to real servers
- **Admin Only**: Some pages only work for admins
- **Validation**: Checks all data before saving

## Problems & Solutions

### Can't Connect to Database
- Check `.env.local` has correct login info
- Make sure MySQL is running
- If error says "too many connections", we need to wait
- Look in `lib/mysql.ts` for settings

### Login Not Working
- Check `.env.local` has `JWT_SECRET`
- Look in `lib/session.ts` for cookie settings

### Code Errors
- Run `npm install` to get all libraries
- Run `npx tsc --noEmit` to check for mistakes
- Run `npm run lint` to find issues

## Before You Change the Code

- Use the same style as existing code
- Use TypeScript (helps catch bugs)
- Keep components small and reusable
- Update this doc if you add big features
- Run `npm run lint` before saving

---

**Last Updated**: May 13, 2026  
**Code**: https://github.com/jas-cmyk/luloyflix
