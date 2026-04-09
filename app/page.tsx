import { getAllArticles } from '@/lib/actions/articles'
import { getCategories } from '@/lib/actions/categories'
import Link from 'next/link'

export default async function HomePage() {
  const [articles, categories] = await Promise.all([getAllArticles(), getCategories()])

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      {/* 상단 검색 히어로 */}
      <div style={{ background: '#1e2023' }} className="py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">
            주린<span style={{ color: '#52b54b' }}>위키</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: '#aaa' }}>주식 생초보를 위한 무료 백과사전</p>
          <form action="/search" className="flex gap-2">
            <input
              name="q"
              placeholder="검색어를 입력하세요 (예: PER, ETF, 배당)"
              className="flex-1 px-4 py-2.5 rounded text-sm focus:outline-none"
              style={{ background: '#2d3035', color: '#fff', border: 'none' }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded text-sm font-bold"
              style={{ background: '#52b54b', color: '#fff' }}
            >
              검색
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 메인 문서 목록 */}
          <div className="flex-1">
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-bold text-sm">최근 문서</h2>
                <span className="text-xs" style={{ color: '#999' }}>총 {articles.length}개</span>
              </div>
              {articles.length === 0 ? (
                <p className="text-center py-12 text-sm" style={{ color: '#999' }}>아직 작성된 문서가 없습니다.</p>
              ) : (
                <ul>
                  {articles.map((article, i) => (
                    <li key={article.id} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                      <Link href={`/wiki/${article.slug}`} className="flex items-start justify-between px-4 py-3 hover:bg-gray-50 transition">
                        <div>
                          <span className="text-sm font-medium" style={{ color: '#1a73e8' }}>{article.title}</span>
                          {article.summary && (
                            <p className="text-xs mt-0.5" style={{ color: '#777' }}>{article.summary}</p>
                          )}
                          {article.categories && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#e8f0fe', color: '#1a73e8' }}>
                              {article.categories.name}
                            </span>
                          )}
                        </div>
                        <span className="text-xs whitespace-nowrap ml-4 mt-0.5" style={{ color: '#bbb' }}>
                          {new Date(article.updated_at).toLocaleDateString('ko-KR')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="w-52 shrink-0 space-y-4">
            {/* 카테고리 */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-sm">카테고리</h2>
              </div>
              <ul className="py-1">
                {categories.length === 0 ? (
                  <li className="px-4 py-2 text-xs" style={{ color: '#999' }}>카테고리 없음</li>
                ) : (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/category/${cat.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-50 transition" style={{ color: '#1a73e8' }}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* 사이트 정보 */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <h2 className="font-bold text-sm mb-2">주린위키란?</h2>
              <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                주식 생초보를 위한 오픈 백과사전입니다. 어려운 주식 용어를 쉽게 설명합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
