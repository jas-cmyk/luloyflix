'use server';

import bcrypt from 'bcryptjs';
import pool from '@/lib/mysql';
import { createUsersTable } from '@/lib/db-init';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    await createUsersTable();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result]: any = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const userId = result.insertId.toString();
    await createSession(userId);

    return { success: true, userId };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 'Email already exists' };
    }
    console.error('Sign up error:', error);
    return { error: 'Failed to create account' };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Invalid email or password' };
    }

    const userId = user.id.toString();
    await createSession(userId);

    return { success: true, userId };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/');
}
