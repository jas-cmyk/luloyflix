'use server';

import bcrypt from 'bcryptjs';
import pool from '@/lib/mysql';
import { createUsersTable } from '@/lib/db-init';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
    
    try {
      await createSession(userId);
    } catch (sessionError) {
      console.error('Failed to create session after signup:', sessionError);
      return { error: 'Account created, but failed to log in automatically. Please try logging in.' };
    }

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 'Email already exists' };
    }
    console.error('Sign up error:', error);
    return { error: 'Failed to create account' };
  }

  revalidatePath('/');
  redirect('/');
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
    
    try {
      await createSession(userId);
    } catch (sessionError) {
      console.error('Failed to create session during login:', sessionError);
      return { error: 'Failed to create session' };
    }

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }

  revalidatePath('/');
  redirect('/');
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
  redirect('/');
}
