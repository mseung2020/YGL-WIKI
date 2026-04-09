import { isAdminLoggedIn } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const loggedIn = await isAdminLoggedIn()
  if (!loggedIn) redirect('/admin/login')

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <header style={{ background: '#1e2023' }} className="relative">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-black text-lg text-white tracking-tight">
              주린<span style={{ color: '#52b54b' }}>위키</span>
            </a>
            <span className="text-xs px-2 py-0.5 rounded hidden sm:inline" style={{ background: '#2d3035', color: '#aaa' }}>관리자</span>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-5">
        {children}
      </main>
    </div>
  )
}
