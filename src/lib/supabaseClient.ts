import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(url: string) {
	if (!url) return url;
	try {
		const u = new URL(url);
		return `${u.protocol}//${u.hostname}`;
	} catch (e) {
		return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
	}
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = normalizeSupabaseUrl(rawUrl);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
