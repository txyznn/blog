import type { Metadata } from 'next';
import PostList from '@/components/PostList';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getArchive } from '@/lib/posts';

export const metadata: Metadata = {
  title: '归档 | Chaowen',
  description: 'Chaowen Notes 的全部文章，按年月归档。',
};

export default function ArchivePage() {
  const groups = getArchive();
  const total = groups.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader sticky />
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          ARCHIVE
        </p>
        <h1 className="serif mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          归档
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          共 {groups.length} 个月 · {total} 篇文章
        </p>

        {groups.map((group) => (
          <section key={group.id} id={group.id} className="mt-14 scroll-mt-28">
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-primary pb-3">
              <h2 className="serif text-2xl font-semibold">{group.label}</h2>
              <span className="text-sm text-muted-foreground">
                {group.posts.length} 篇
              </span>
            </div>
            <PostList posts={group.posts} firstAccent={false} />
          </section>
        ))}
      </section>
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </main>
  );
}
