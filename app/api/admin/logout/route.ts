import { logoutAdmin } from '@/lib/actions/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  await logoutAdmin()
  return NextResponse.json({ ok: true })
}
