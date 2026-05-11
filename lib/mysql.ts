import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var pool: mysql.Pool | undefined;
}

const getPoolConfig = (): mysql.PoolOptions => {
  if (process.env.DATABASE_URL) {
    return {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DATABASE_SSL_CA ? {
        ca: process.env.DATABASE_SSL_CA,
        rejectUnauthorized: true
      } : (process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined),
    };
  }

  return {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DATABASE_SSL_CA ? {
      ca: process.env.DATABASE_SSL_CA,
      rejectUnauthorized: true
    } : (process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : undefined),
  };
};

const pool = global.pool || mysql.createPool(getPoolConfig());

if (process.env.NODE_ENV !== 'production') {
  global.pool = pool;
}

export default pool;
