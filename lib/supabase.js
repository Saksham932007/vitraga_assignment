// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// It's a good practice to centralize your Supabase client initialization.
// This way, you can import it into any server-side component or API route.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL or Service Role Key is not defined in environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
