import Link from 'next/link'

export default function Navbar() {
  return (
    <header style={{ background: '#1e2023' }}>
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="font-black text-lg text-white tracking-tight">
          주린<span style={{ color: '#52b54b' }}>위키</span>
        </Link>
        <form action="/search" className="flex gap-2">
          <input
            name="q"
            placeholder="검색..."
            className="text-sm px-3 py-1.5 rounded w-52 focus:outline-none"
            style={{ background: '#2d3035', color: '#fff', border: 'none' }}
          />
          <button
            type="submit"
            className="text-sm px-3 py-1.5 rounded font-medium"
            style={{ background: '#52b54b', color: '#fff' }}
          >
            검색
          </button>
        </form>
      </div>
    </header>
  )
}
