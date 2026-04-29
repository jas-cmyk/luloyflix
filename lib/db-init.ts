import pool from './mysql';

export async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      subscription_tier ENUM('none', 'starter', 'plus', 'premium') DEFAULT 'none',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);

  // Migration to add subscription_tier if it doesn't exist (for existing tables)
  try {
    await pool.query("ALTER TABLE users ADD COLUMN subscription_tier ENUM('none', 'starter', 'plus', 'premium') DEFAULT 'none'");
  } catch (e) {
    // Ignore error if column already exists
  }
}

export async function createPurchasesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      movie_id INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_purchase (user_id, movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await pool.query(query);
}

export async function createTransactionsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await pool.query(query);
}

export async function createAdsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url VARCHAR(255),
      video_url VARCHAR(255),
      link_url VARCHAR(255),
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);

  // Migration to add video_url if it doesn't exist
  try {
    await pool.query("ALTER TABLE ads ADD COLUMN video_url VARCHAR(255)");
  } catch (e) {
    // Ignore error if column already exists
  }
}

export async function createRedeemCodesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS redeem_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      benefit_type ENUM('tier', 'movie', 'credit') NOT NULL DEFAULT 'tier',
      benefit_data VARCHAR(255) NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      used_by INT,
      used_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (used_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `;
  await pool.query(query);

  // Migration for existing tables
  try {
    await pool.query("ALTER TABLE redeem_codes ADD COLUMN benefit_type ENUM('tier', 'movie', 'credit') NOT NULL DEFAULT 'tier'");
    await pool.query("ALTER TABLE redeem_codes ADD COLUMN benefit_data VARCHAR(255)");
    // Move existing tier data to benefit_data if it exists
    await pool.query("UPDATE redeem_codes SET benefit_data = tier WHERE benefit_data IS NULL AND tier IS NOT NULL");
  } catch (e) {
    // Ignore if columns already exist
  }
}

export async function createFeaturesTables() {
  // Favorites Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      movie_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_favorite (user_id, movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Recently Watched Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recently_watched (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      movie_id INT NOT NULL,
      watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_recent (user_id, movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Ratings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      movie_id INT NOT NULL,
      rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_rating (user_id, movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}
