import { isAdminLoggedIn } from '@/lib/actions/auth'
import { rollbackToRevision } from '@/lib/actions/revisions'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { articleId, revisionId, author_name } = await req.json()

  try {
    await rollbackToRevision({ articleId, revisionId, author_name })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
