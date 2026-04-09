import { createClient } from '@supabase/supabase-js'

// 서비스 롤 키 사용 — RLS 우회, 서버에서만 사용
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
