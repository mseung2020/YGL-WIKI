import { getArticleBySlug } from '@/lib/actions/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      {/* 탭 바 */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <div className="max-w-5xl mx-auto px-4 flex">
          <div className="text-sm px-3 py-2 font-semibold border-b-2" style={{ color: '#1a73e8', borderColor: '#1a73e8' }}>문서</div>
          <Link href={`/wiki/${slug}/history`} className="text-sm px-3 py-2 hover:bg-gray-100 transition" style={{ color: '#555' }}>편집 기록</Link>
          <Link href={`/admin/articles/${article.id}/edit`} className="text-sm px-3 py-2 hover:bg-gray-100 transition" style={{ color: '#555' }}>편집</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-5">
          {/* 본문 */}
          <div className="flex-1 min-w-0 bg-white rounded border border-gray-200 p-4 md:p-6">
            {article.categories && (
              <Link
                href={`/category/${article.categories.slug}`}
                className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
                style={{ background: '#e8f0fe', color: '#1a73e8' }}
              >
                {article.categories.name}
              </Link>
            )}

            <h1 className="text-xl md:text-2xl font-black mb-1 tracking-tight">{article.title}</h1>
            <div className="text-xs mb-4 pb-4 border-b border-gray-100" style={{ color: '#999' }}>
              최근 수정: {new Date(article.updated_at).toLocaleDateString('ko-KR')}
            </div>

            <div className="wiki-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* 사이드바 - 데스크탑만 */}
          <div className="w-48 shrink-0 space-y-4 hidden md:block">
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-sm">바로가기</h3>
              </div>
              <ul className="py-1">
                <li>
                  <Link href={`/wiki/${slug}/history`} className="block px-4 py-2 text-sm hover:bg-gray-50 transition" style={{ color: '#1a73e8' }}>
                    편집 기록
                  </Link>
                </li>
                <li>
                  <Link href="/" className="block px-4 py-2 text-sm hover:bg-gray-50 transition" style={{ color: '#1a73e8' }}>
                    홈으로
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="block px-4 py-2 text-sm hover:bg-gray-50 transition" style={{ color: '#1a73e8' }}>
                    검색
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} - 주린위키`,
    description: article.summary ?? `${article.title}에 대한 주린위키 문서입니다.`,
  }
}
