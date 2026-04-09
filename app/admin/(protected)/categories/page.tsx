'use client'

import { useState, useEffect } from 'react'

interface Category { id: string; name: string; slug: string }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchCategories() {
    const res = await fetch('/api/admin/categories')
    setCategories(await res.json())
  }

  useEffect(() => { fetchCategories() }, [])

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
    setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    if (res.ok) { setName(''); setSlug(''); fetchCategories() }
    else { const d = await res.json(); setError(d.error ?? '오류가 발생했습니다.') }
    setLoading(false)
  }

  async function handleDelete(id: string, categoryName: string) {
    if (!confirm(`"${categoryName}" 카테고리를 삭제하시겠습니까?\n해당 카테고리의 문서들은 미분류 상태가 됩니다.`)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  const inputCls = "w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
  const labelCls = "block text-xs font-semibold mb-1.5"

  return (
    <div className="max-w-xl">
      <h1 className="font-bold text-base mb-4">카테고리 관리</h1>

      {/* 추가 폼 */}
      <form onSubmit={handleAdd} className="bg-white rounded border border-gray-200 p-4 mb-4 space-y-3">
        <p className="text-xs font-semibold" style={{ color: '#555' }}>새 카테고리 추가</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={{ color: '#555' }}>이름</label>
            <input value={name} onChange={handleNameChange} placeholder="예: 기본 용어" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls} style={{ color: '#555' }}>슬러그 <span style={{ color: '#999', fontWeight: 400 }}>(영문만)</span></label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="예: basic-terms" className={inputCls} required />
          </div>
        </div>
        {error && <p className="text-xs" style={{ color: '#e53e3e' }}>{error}</p>}
        <button type="submit" disabled={loading} className="px-4 py-2 rounded text-sm font-bold text-white disabled:opacity-50" style={{ background: '#1a73e8' }}>
          {loading ? '추가 중...' : '추가'}
        </button>
      </form>

      {/* 목록 */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#999' }}>아직 카테고리가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#555' }}>이름</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#555' }}>슬러그</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                  <td className="px-4 py-3 text-sm">{cat.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#999' }}>{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="text-xs hover:underline" style={{ color: '#e53e3e' }}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
