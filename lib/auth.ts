import { getSession } from './session';
import pool from './mysql';

export async function getCurrentUser() {
  const session = await getSession();
  if (!session || !session.userId) return null;

  try {
    const [rows]: any = await pool.query('SELECT id, email FROM users WHERE id = ?', [session.userId]);
    return rows[0] || null;
  } catch (error) {
    return null;
  }
}
