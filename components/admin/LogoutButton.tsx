'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <button onClick={handleLogout} className="text-sm hover:text-white transition" style={{ color: '#aaa' }}>
      로그아웃
    </button>
  )
}
