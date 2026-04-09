'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false })

interface Category { id: string; name: string }

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({ title: '', content: '', summary: '', category_id: '', author_name: '', comment: '' })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/articles/${id}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ]).then(([article, cats]) => {
      setForm({ title: article.title, content: article.content, summary: article.summary ?? '', category_id: article.category_id ?? '', author_name: '', comment: '' })
      setSlug(article.slug)
      setCategories(cats)
      setFetching(false)
    })
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? '저장 실패') }
      router.push(`/wiki/${slug}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally { setLoading(false) }
  }

  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin')
  }

  if (fetching) return <div className="text-sm" style={{ color: '#999' }}>불러오는 중...</div>

  const inputCls = "w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
  const labelCls = "block text-xs font-semibold mb-1.5"

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-base">문서 편집</h1>
        <button onClick={() => router.back()} className="text-xs" style={{ color: '#999' }}>취소</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: '#555' }}>제목</label>
              <input name="title" value={form.title} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls} style={{ color: '#555' }}>카테고리 (선택)</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className={inputCls} style={{ background: '#fff' }}>
                <option value="">카테고리 없음</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls} style={{ color: '#555' }}>요약 (선택)</label>
            <input name="summary" value={form.summary} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-4">
          <label className={labelCls} style={{ color: '#555' }}>본문</label>
          <TipTapEditor content={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
        </div>

        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: '#555' }}>작성자 이름</label>
              <input name="author_name" value={form.author_name} onChange={handleChange} placeholder="이름 입력" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls} style={{ color: '#555' }}>편집 메모 (선택)</label>
              <input name="comment" value={form.comment} onChange={handleChange} placeholder="어떤 내용을 수정했나요?" className={inputCls} />
            </div>
          </div>
        </div>

        {error && <p className="text-xs" style={{ color: '#e53e3e' }}>{error}</p>}

        <div className="flex justify-between items-center">
          <button type="submit" disabled={loading} className="px-8 py-2.5 rounded text-sm font-bold text-white disabled:opacity-50" style={{ background: '#1a73e8' }}>
            {loading ? '저장 중...' : '저장'}
          </button>
          <button type="button" onClick={handleDelete} className="text-xs hover:underline" style={{ color: '#e53e3e' }}>
            문서 삭제
          </button>
        </div>
      </form>
    </div>
  )
}
