import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(url: string) {
	if (!url) return url;
	try {
		const u = new URL(url);
		return `${u.protocol}//${u.hostname}`;
	} catch (e) {
		// fallback: remove known suffix
		return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
	}
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = normalizeSupabaseUrl(rawUrl);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server client: do not persist sessions here
const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

export default supabaseServer;
