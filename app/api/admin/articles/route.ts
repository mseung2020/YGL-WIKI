import { isAdminLoggedIn } from '@/lib/actions/auth'
import { createArticle } from '@/lib/actions/articles'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  try {
    const article = await createArticle(body)
    return NextResponse.json(article)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
