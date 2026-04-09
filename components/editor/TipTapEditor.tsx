'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: '문서 내용을 입력하세요...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const btn = (action: () => boolean, label: string, active?: boolean) => (
    <button
      type="button"
      onClick={() => action()}
      className={`px-2 py-1 rounded text-sm hover:bg-gray-200 ${active ? 'bg-gray-200 font-bold' : ''}`}
    >
      {label}
    </button>
  )

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleStrike().run(), 'S', editor.isActive('strike'))}
        {btn(() => editor.chain().focus().toggleCode().run(), '코드', editor.isActive('code'))}
        <div className="w-px bg-gray-300 mx-1" />
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
        <div className="w-px bg-gray-300 mx-1" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), '• 목록', editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. 목록', editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), '인용', editor.isActive('blockquote'))}
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('링크 URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          className={`px-2 py-1 rounded text-sm hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          링크
        </button>
      </div>

      {/* 편집 영역 */}
      <EditorContent
        editor={editor}
        className="prose prose-neutral max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  )
}
