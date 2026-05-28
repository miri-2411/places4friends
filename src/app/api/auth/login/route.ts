import { NextResponse } from 'next/server';
import supabaseServer from '../../../../lib/supabaseServer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Look up user in custom users table
    const { data: user, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Sign a JWT to represent a session (short-lived as appropriate)
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set httpOnly cookie
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    const isProd = process.env.NODE_ENV === 'production';
    const cookie = `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}` + (isProd ? '; Secure' : '');

    return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 200, headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
