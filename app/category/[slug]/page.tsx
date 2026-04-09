import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('id, slug, title, summary, updated_at')
    .eq('category_id', category.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-base">{category.name}</h1>
              <p className="text-xs mt-0.5" style={{ color: '#999' }}>총 {articles?.length ?? 0}개 문서</p>
            </div>
            <Link href="/" className="text-xs" style={{ color: '#1a73e8' }}>← 홈으로</Link>
          </div>
          {!articles || articles.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: '#999' }}>이 카테고리에 문서가 없습니다.</p>
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
    </div>
  )
}
