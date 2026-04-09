'use server'

import { cookies } from 'next/headers'

const ADMIN_SESSION_KEY = 'admin_session'

export async function loginAdmin(password: string): Promise<boolean> {
  if (password !== process.env.ADMIN_PASSWORD) return false

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_KEY, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7일
  })

  return true
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_KEY)
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_SESSION_KEY)?.value === 'true'
}
