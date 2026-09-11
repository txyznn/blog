import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import PostList from '@/components/PostList';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { Input } from '@/components/ui/input';
import { searchPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: '搜索文章 | Chaowen',
  description: '搜索 Chaowen Notes 中的文章。',
};

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const posts = searchPosts(q);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader sticky />
      <section className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">SEARCH</p>
        <h1 className="serif mt-3 text-4xl font-bold tracking-tight md:text-5xl">搜索文章</h1>
        <form className="relative mt-8" action="/search">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="输入标题、摘要、分类或标签" className="h-12 pl-10 pr-4" />
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          {q ? `找到 ${posts.length} 篇与「${q}」相关的文章` : '输入关键词开始搜索。'}
        </p>
        <div className="mt-8">
          {q ? <PostList posts={posts} emptyText="没有找到相关文章。" /> : <Link className="text-sm text-primary hover:underline" href="/">返回首页</Link>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
