
import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://egyfaoeygpvzktvxffca.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_OWGq8KX0V_n4skLMWjzGFQ_Dr5jxrMO";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
