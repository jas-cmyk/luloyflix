import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var pool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var dbInitialized: boolean | undefined;
}

const getPoolConfig = (): mysql.PoolOptions => {
  const commonConfig: Partial<mysql.PoolOptions> = {
    waitForConnections: true,
    connectionLimit: 5, // Reduced from 20 to 5 to avoid "Too many connections"
    maxIdle: 5, // Max idle connections
    idleTimeout: 30000, // Reduced from 60s to 30s to release connections faster
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  };

  // Fix escaped newlines in CA string if pulled from Vercel/CLI
  const ca = process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n');

  const sslConfig = ca ? {
    ca,
    rejectUnauthorized: true
  } : {
    rejectUnauthorized: false
  };

  if (process.env.DATABASE_URL) {
    return {
      uri: process.env.DATABASE_URL,
      ...commonConfig,
      ssl: sslConfig,
    };
  }

  return {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    ...commonConfig,
    ssl: sslConfig,
  };
};

const pool = global.pool || mysql.createPool(getPoolConfig());

if (process.env.NODE_ENV !== 'production') {
  global.pool = pool;
}

// Robust auto-initialization
const initializeDb = async () => {
  if (global.dbInitialized) return;
  global.dbInitialized = true; // Mark as initialized immediately to prevent concurrent runs

  try {
    const m = await import('./db-init');
    console.log('Initializing database schema...');
    await m.createUsersTable();
    await m.createPurchasesTable();
    await m.createTransactionsTable();
    await m.createAdsTable();
    await m.createRedeemCodesTable();
    await m.createFeaturesTables();
    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Failed to auto-initialize database:', error);
    global.dbInitialized = false; // Reset on failure so it can retry next time
  }
};

initializeDb();

export default pool;
