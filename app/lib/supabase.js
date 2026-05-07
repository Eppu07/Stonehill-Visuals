import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Yksi jaettu client — turvallinen näytettäväksi clientissä, koska RLS estää
// kaiken muun kuin INSERTin bookings-tauluun.
export const supabase = url && anonKey ? createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
}) : null;
