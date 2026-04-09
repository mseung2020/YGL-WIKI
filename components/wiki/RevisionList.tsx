'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Revision {
  id: string
  author_name: string
  comment: string | null
  created_at: string
  content: string
}

interface Props {
  revisions: Revision[]
  articleId: string
  slug: string
}

export default function RevisionList({ revisions, articleId, slug }: Props) {
  const router = useRouter()
  const [rollbackingId, setRollbackingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function handleRollback(revisionId: string) {
    const author = prompt('되돌리기를 실행할 작성자 이름을 입력하세요')
    if (!author) return

    setRollbackingId(revisionId)

    const res = await fetch('/api/admin/revisions/rollback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, revisionId, author_name: author }),
    })

    if (res.ok) {
      router.push(`/wiki/${slug}`)
      router.refresh()
    } else if (res.status === 401) {
      alert('어드민 로그인이 필요합니다.')
    } else {
      alert('되돌리기에 실패했습니다.')
    }

    setRollbackingId(null)
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (revisions.length === 0) {
    return <p className="text-sm text-center py-8" style={{ color: '#999' }}>편집 기록이 없습니다.</p>
  }

  return (
    <div className="space-y-2">
      {revisions.map((rev, index) => (
        <div key={rev.id} className="border border-gray-200 rounded overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div>
              <span className="text-sm font-semibold">{rev.author_name}</span>
              <span className="text-xs ml-3" style={{ color: '#999' }}>
                {new Date(rev.created_at).toLocaleString('ko-KR')}
              </span>
              {rev.comment && (
                <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ background: '#f0f0f0', color: '#555' }}>
                  {rev.comment}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {index === 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#e8f4e8', color: '#2d6a4f' }}>현재</span>
              )}
              <button
                onClick={() => toggleExpand(rev.id)}
                className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-white transition"
                style={{ color: '#555' }}
              >
                {expandedId === rev.id ? '닫기' : '내용 보기'}
              </button>
              {index !== 0 && (
                <button
                  onClick={() => handleRollback(rev.id)}
                  disabled={rollbackingId === rev.id}
                  className="text-xs px-2 py-1 rounded border font-medium disabled:opacity-50 transition"
                  style={{ color: '#1a73e8', borderColor: '#1a73e8', background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e8f0fe')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {rollbackingId === rev.id ? '처리 중...' : '되돌리기'}
                </button>
              )}
            </div>
          </div>
          {expandedId === rev.id && (
            <div className="border-t border-gray-200 px-4 py-4 bg-white">
              <div className="wiki-content" dangerouslySetInnerHTML={{ __html: rev.content }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
