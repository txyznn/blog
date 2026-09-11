import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllSeries } from '@/lib/posts';

export const metadata: Metadata = {
  title: '专栏 | Chaowen',
  description: '按专题整理的系列文章。',
};

export default function SeriesPage() {
  const series = getAllSeries();
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader sticky />
      <section className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">SERIES</p>
        <h1 className="serif mt-3 text-4xl font-bold tracking-tight md:text-5xl">专栏</h1>
        <p className="mt-4 text-sm text-muted-foreground">把相关主题串联起来，按系列持续记录和学习。</p>
        {series.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {series.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <Card className="h-full transition-colors group-hover:border-primary">
                  <CardHeader><CardTitle className="flex items-center justify-between gap-4"><span className="flex items-center gap-2"><BookOpen className="size-5 text-primary" />{item.name}</span><ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.count} 篇文章</CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : <p className="mt-10 border-t-2 border-primary py-10 text-sm text-muted-foreground">暂时还没有专栏，发布文章时添加 `series` 字段即可。</p>}
      </section>
      <SiteFooter />
    </main>
  );
}
