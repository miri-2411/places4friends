import { NextResponse } from 'next/server';

export async function POST() {
  const cookie = `token=deleted; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` + (process.env.NODE_ENV === 'production' ? '; Secure' : '');
  return NextResponse.json({ ok: true }, { status: 200, headers: { 'Set-Cookie': cookie } });
}
