import { getArticleBySlug } from '@/lib/actions/articles'
import { getRevisionsByArticleId } from '@/lib/actions/revisions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RevisionList from '@/components/wiki/RevisionList'

export default async function HistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const revisions = await getRevisionsByArticleId(article.id)

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      {/* 탭 바 */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <div className="max-w-5xl mx-auto px-4 flex">
          <Link href={`/wiki/${slug}`} className="text-sm px-4 py-2 hover:bg-gray-100 transition" style={{ color: '#555' }}>문서</Link>
          <div className="text-sm px-4 py-2 font-semibold border-b-2" style={{ color: '#1a73e8', borderColor: '#1a73e8' }}>편집 기록</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h1 className="font-bold text-base">{article.title} — 편집 기록</h1>
            <p className="text-xs mt-0.5" style={{ color: '#999' }}>총 {revisions.length}개의 편집 기록</p>
          </div>
          <div className="p-4">
            <RevisionList revisions={revisions} articleId={article.id} slug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
