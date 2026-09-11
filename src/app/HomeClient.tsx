import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import HomeSidebar from '@/components/HomeSidebar';
import NewsletterSection from '@/components/NewsletterSection';
import PostList from '@/components/PostList';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import type { ArchiveGroup, Post, Term } from '@/lib/types';

export default function Home({
  posts,
  tags,
  categories,
  archive,
}: {
  posts: Post[];
  tags: Term[];
  categories: Term[];
  archive: ArchiveGroup[];
}) {
  return (
    <main className="mx-auto my-0 max-w-[1440px] bg-background shadow-sm md:my-7 md:rounded-lg">
      <a href="#content" className="sr-only focus:not-sr-only">
        跳到正文
      </a>
      <SiteHeader />
      <HeroSection />

      <div id="content" className="grid gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:px-14">
        <section>
          <div className="mb-7 flex items-center justify-between">
            <h2 className="serif text-2xl font-semibold">最新文章</h2>
            <Link className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary" href="/archive">
              查看全部 <ChevronRight size={16} />
            </Link>
          </div>
          <PostList posts={posts} emptyText="还没有发布文章。" />
        </section>
        <HomeSidebar tags={tags} categories={categories} archive={archive} />
      </div>

      <NewsletterSection />
      <SiteFooter />
    </main>
  );
}
