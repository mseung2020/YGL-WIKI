import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded border border-gray-200 p-10 text-center max-w-sm w-full">
        <div className="text-5xl font-black mb-3" style={{ color: '#1a73e8' }}>404</div>
        <p className="font-bold mb-1">문서를 찾을 수 없습니다.</p>
        <p className="text-sm mb-6" style={{ color: '#999' }}>삭제됐거나 아직 작성되지 않은 문서예요.</p>
        <div className="flex gap-2 justify-center">
          <Link href="/" className="text-sm px-4 py-2 rounded font-medium text-white" style={{ background: '#1a73e8' }}>
            홈으로
          </Link>
          <Link href="/search" className="text-sm px-4 py-2 rounded font-medium border border-gray-200 hover:bg-gray-50">
            검색하기
          </Link>
        </div>
      </div>
    </div>
  )
}
