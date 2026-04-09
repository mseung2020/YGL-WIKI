import { getAllArticles } from '@/lib/actions/articles'
import Link from 'next/link'

export default async function AdminDashboard() {
  const articles = await getAllArticles()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-base">문서 목록</h1>
        <span className="text-xs" style={{ color: '#999' }}>총 {articles.length}개</span>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#555' }}>제목</th>
              <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#555' }}>슬러그</th>
              <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#555' }}>카테고리</th>
              <th className="text-left px-4 py-3 font-semibold text-xs" style={{ color: '#555' }}>최근 수정</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, i) => (
              <tr key={article.id} className={i !== 0 ? 'border-t border-gray-100' : ''}>
                <td className="px-4 py-3">
                  <Link href={`/wiki/${article.slug}`} className="font-medium hover:underline" style={{ color: '#1a73e8' }} target="_blank">
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#999' }}>{article.slug}</td>
                <td className="px-4 py-3">
                  {article.categories ? (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#e8f0fe', color: '#1a73e8' }}>
                      {article.categories.name}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#ccc' }}>-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#999' }}>
                  {new Date(article.updated_at).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${article.id}/edit`} className="text-xs font-medium hover:underline" style={{ color: '#1a73e8' }}>
                    편집
                  </Link>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#999' }}>
                  아직 작성된 문서가 없습니다.{' '}
                  <Link href="/admin/articles/new" className="hover:underline" style={{ color: '#1a73e8' }}>
                    첫 문서 작성하기
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
