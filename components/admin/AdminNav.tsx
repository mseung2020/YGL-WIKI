'use client'

import { useState } from 'react'
import LogoutButton from './LogoutButton'

export default function AdminNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 데스크탑 메뉴 */}
      <div className="hidden md:flex items-center gap-3">
        <a href="/admin/categories" className="text-sm px-3 py-1.5 rounded font-medium" style={{ background: '#2d3035', color: '#fff' }}>카테고리 관리</a>
        <a href="/admin/articles/new" className="text-sm px-3 py-1.5 rounded font-medium" style={{ background: '#52b54b', color: '#fff' }}>+ 새 문서</a>
        <LogoutButton />
      </div>

      {/* 모바일 햄버거 버튼 */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        onClick={() => setOpen((v) => !v)}
        aria-label="메뉴"
      >
        <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: open ? 'translateY(6px) rotate(45deg)' : '' }} />
        <span className="block w-5 h-0.5 bg-white transition-all" style={{ opacity: open ? 0 : 1 }} />
        <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: open ? 'translateY(-6px) rotate(-45deg)' : '' }} />
      </button>

      {/* 모바일 드롭다운 메뉴 */}
      {open && (
        <div
          className="md:hidden absolute top-12 left-0 right-0 z-50 border-t"
          style={{ background: '#1e2023', borderColor: '#2d3035' }}
        >
          <a
            href="/admin"
            className="flex items-center px-4 py-3 text-sm border-b"
            style={{ color: '#fff', borderColor: '#2d3035' }}
            onClick={() => setOpen(false)}
          >
            📋 문서 목록
          </a>
          <a
            href="/admin/articles/new"
            className="flex items-center px-4 py-3 text-sm border-b"
            style={{ color: '#52b54b', borderColor: '#2d3035' }}
            onClick={() => setOpen(false)}
          >
            ✏️ 새 문서 작성
          </a>
          <a
            href="/admin/categories"
            className="flex items-center px-4 py-3 text-sm border-b"
            style={{ color: '#fff', borderColor: '#2d3035' }}
            onClick={() => setOpen(false)}
          >
            🗂️ 카테고리 관리
          </a>
          <div className="px-4 py-3">
            <LogoutButton />
          </div>
        </div>
      )}
    </>
  )
}
