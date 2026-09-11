import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostList from '@/components/PostList';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { Badge } from '@/components/ui/badge';
import { getAllSeries, getPostsBySeries } from '@/lib/posts';

export const dynamicParams = false;
type PageProps = { params: Promise<{ series: string }> };

export function generateStaticParams() {
  return getAllSeries().map((item) => ({ series: item.name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series: encodedSeries } = await params;
  const series = decodeURIComponent(encodedSeries);
  return { title: `${series} | Chaowen`, description: `Chaowen Notes「${series}」专栏文章。` };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { series: encodedSeries } = await params;
  const series = decodeURIComponent(encodedSeries);
  const posts = getPostsBySeries(series);
  if (!posts.length) notFound();
  const allSeries = getAllSeries();
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader sticky />
      <section className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">SERIES</p>
        <h1 className="serif mt-3 text-4xl font-bold tracking-tight md:text-5xl">{series}</h1>
        <p className="mt-4 text-sm text-muted-foreground">共 {posts.length} 篇文章 · 按发布时间倒序排列</p>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="全部专栏">
          {allSeries.map((item) => <Badge key={item.name} asChild variant={item.name === series ? 'default' : 'outline'} className="px-3 py-1.5 font-normal"><Link href={item.href}>{item.name} {item.count}</Link></Badge>)}
        </nav>
        <div className="mt-10"><PostList posts={posts} /></div>
      </section>
      <SiteFooter />
    </main>
  );
}
