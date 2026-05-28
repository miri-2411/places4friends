import { NextResponse } from 'next/server';
import supabaseServer from '../../../../lib/supabaseServer';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, username } = body ?? {};

    if (!email || !password || !name || !username) {
      return NextResponse.json({ error: 'Missing email, password, name or username' }, { status: 400 });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Insert into users table (include optional name and username)
    const insertObj: any = { email, password_hash };
    if (name) insertObj.name = name;
    if (username) insertObj.username = username;

    const { data, error } = await supabaseServer
      .from('users')
      .insert([insertObj])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (err: any) {
    console.error('Register handler error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) ?? 'Server error' }, { status: 500 });
  }
}
