'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) return []
  return data
}
