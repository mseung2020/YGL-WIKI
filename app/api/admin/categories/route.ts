import { isAdminLoggedIn } from '@/lib/actions/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, slug } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
