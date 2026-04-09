import { searchArticles } from '@/lib/actions/articles'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const results = q ? await searchArticles(q) : []

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 검색 폼 */}
        <div className="bg-white rounded border border-gray-200 p-4 mb-4">
          <form action="/search" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="검색어를 입력하세요"
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded text-sm font-bold text-white"
              style={{ background: '#1a73e8' }}
            >
              검색
            </button>
          </form>
        </div>

        {/* 결과 */}
        {q && (
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <span className="text-sm font-bold">&ldquo;{q}&rdquo;</span>
              <span className="text-sm ml-1" style={{ color: '#999' }}>검색 결과 {results.length}건</span>
            </div>
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm mb-2" style={{ color: '#999' }}>검색 결과가 없습니다.</p>
                <Link href="/" className="text-sm" style={{ color: '#1a73e8' }}>홈으로 돌아가기</Link>
              </div>
            ) : (
              <ul>
                {results.map((article, i) => (
                  <li key={article.id} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                    <Link href={`/wiki/${article.slug}`} className="block px-4 py-3 hover:bg-gray-50 transition">
                      <p className="text-sm font-semibold" style={{ color: '#1a73e8' }}>{article.title}</p>
                      {article.summary && (
                        <p className="text-xs mt-0.5" style={{ color: '#777' }}>{article.summary}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!q && (
          <div className="bg-white rounded border border-gray-200 py-12 text-center">
            <p className="text-sm" style={{ color: '#999' }}>검색어를 입력하면 결과가 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
