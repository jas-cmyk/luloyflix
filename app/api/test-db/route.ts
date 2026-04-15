import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { createUsersTable, createPurchasesTable } from '@/lib/db-init';

export async function GET() {
  try {
    await createUsersTable();
    await createPurchasesTable();
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    return NextResponse.json({ success: true, message: 'Database tables initialized', data: rows });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
