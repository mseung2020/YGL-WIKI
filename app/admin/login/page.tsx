'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded border border-gray-200 w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200" style={{ background: '#1e2023' }}>
          <h1 className="text-base font-black text-white tracking-tight">
            주린<span style={{ color: '#52b54b' }}>위키</span>
            <span className="ml-2 text-xs font-normal" style={{ color: '#aaa' }}>관리자 로그인</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555' }}>비밀번호</label>
            <input
              type="password"
              placeholder="관리자 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          {error && <p className="text-xs" style={{ color: '#e53e3e' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-sm font-bold text-white disabled:opacity-50"
            style={{ background: '#1a73e8' }}
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
