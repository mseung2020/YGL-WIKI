'use server'

import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

export interface Article {
  id: string
  slug: string
  title: string
  content: string
  summary: string | null
  category_id: string | null
  created_at: string
  updated_at: string
  categories: { id: string; name: string; slug: string } | null
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`*, categories(id, name, slug)`)
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Article
}

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`id, slug, title, summary, updated_at, category_id, content, created_at, categories(id, name, slug)`)
    .order('updated_at', { ascending: false })

  if (error) return []
  return (data ?? []) as unknown as Article[]
}

export async function createArticle({
  slug,
  title,
  content,
  summary,
  category_id,
  author_name,
  comment,
}: {
  slug: string
  title: string
  content: string
  summary?: string
  category_id?: string
  author_name: string
  comment?: string
}) {
  const { data: article, error } = await supabase
    .from('articles')
    .insert({ slug, title, content, summary, category_id: category_id || null })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('revisions').insert({
    article_id: article.id,
    content,
    author_name,
    comment,
  })

  return article
}

export async function updateArticle({
  id,
  title,
  content,
  summary,
  category_id,
  author_name,
  comment,
}: {
  id: string
  title: string
  content: string
  summary?: string
  category_id?: string
  author_name: string
  comment?: string
}) {
  const { data: article, error } = await supabase
    .from('articles')
    .update({ title, content, summary, category_id: category_id || null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('revisions').insert({
    article_id: id,
    content,
    author_name,
    comment,
  })

  return article
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function searchArticles(query: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, summary')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(20)

  if (error) return []
  return data
}
