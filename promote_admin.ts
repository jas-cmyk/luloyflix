import pool from './lib/mysql';

async function promote() {
  try {
    console.log('Promoting user with ID 1 to admin...');
    const [result]: any = await pool.query('UPDATE users SET is_admin = TRUE WHERE id = 1');
    if (result.affectedRows > 0) {
      console.log('Success: User ID 1 is now an admin.');
    } else {
      console.log('User ID 1 not found or already admin.');
    }
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    process.exit(0);
  }
}

promote();
