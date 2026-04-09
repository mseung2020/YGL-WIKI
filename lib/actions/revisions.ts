'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

export async function getRevisionsByArticleId(articleId: string) {
  const { data, error } = await supabase
    .from('revisions')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function rollbackToRevision({
  articleId,
  revisionId,
  author_name,
}: {
  articleId: string
  revisionId: string
  author_name: string
}) {
  const { data: revision, error: revError } = await supabase
    .from('revisions')
    .select('content')
    .eq('id', revisionId)
    .single()

  if (revError || !revision) throw new Error('리비전을 찾을 수 없습니다.')

  const { error } = await supabase
    .from('articles')
    .update({ content: revision.content, updated_at: new Date().toISOString() })
    .eq('id', articleId)

  if (error) throw new Error(error.message)

  await supabase.from('revisions').insert({
    article_id: articleId,
    content: revision.content,
    author_name,
    comment: '이전 버전으로 롤백',
  })
}
