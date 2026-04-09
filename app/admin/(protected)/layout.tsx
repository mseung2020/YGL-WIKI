import { isAdminLoggedIn } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const loggedIn = await isAdminLoggedIn()
  if (!loggedIn) redirect('/admin/login')

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <header style={{ background: '#1e2023' }}>
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="font-black text-lg text-white tracking-tight">
              주린<span style={{ color: '#52b54b' }}>위키</span>
            </a>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#2d3035', color: '#aaa' }}>관리자</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/categories" className="text-sm px-3 py-1.5 rounded font-medium" style={{ background: '#2d3035', color: '#fff' }}>카테고리 관리</a>
            <a href="/admin/articles/new" className="text-sm px-3 py-1.5 rounded font-medium" style={{ background: '#52b54b', color: '#fff' }}>
              + 새 문서
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
