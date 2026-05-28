import jwt from 'jsonwebtoken';
import supabaseServer from './supabaseServer';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email?: string };
    const userId = decoded.sub;
    const { data: user, error } = await supabaseServer.from('users').select('*').eq('id', userId).single();
    if (error || !user) return null;
    return user;
  } catch (err) {
    return null;
  }
}
