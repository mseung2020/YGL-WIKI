import Link from 'next/link'

export default function Navbar() {
  return (
    <header style={{ background: '#1e2023' }}>
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-3">
        <Link href="/" className="font-black text-lg text-white tracking-tight shrink-0">
          주린<span style={{ color: '#52b54b' }}>위키</span>
        </Link>
        <form action="/search" className="flex gap-2 flex-1 max-w-sm">
          <input
            name="q"
            placeholder="검색..."
            className="text-sm px-3 py-1.5 rounded flex-1 min-w-0 focus:outline-none"
            style={{ background: '#2d3035', color: '#fff', border: 'none' }}
          />
          <button
            type="submit"
            className="text-sm px-3 py-1.5 rounded font-medium shrink-0"
            style={{ background: '#52b54b', color: '#fff' }}
          >
            검색
          </button>
        </form>
      </div>
    </header>
  )
}
