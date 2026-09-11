import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostList from '@/components/PostList';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { Badge } from '@/components/ui/badge';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';

export const dynamicParams = false;

type PageProps = {params: Promise<{category: string}>};

export function generateStaticParams() {
  return getAllCategories().map((term) => ({category: term.name}));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {category: encodedCategory} = await params;
  const category = decodeURIComponent(encodedCategory);
  return {
    title: `${category} | Chaowen`,
    description: `Chaowen Notes 中「${category}」分类下的全部文章。`,
  };
}

export default async function CategoryPage({params}: PageProps) {
  const {category: encodedCategory} = await params;
  const category = decodeURIComponent(encodedCategory);
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();
  const categories = getAllCategories();

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader sticky />
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          CATEGORY
        </p>
        <h1 className="serif mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          {category}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          共 {posts.length} 篇文章
        </p>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="全部分类">
          {categories.map((term) => (
            <Badge
              key={term.name}
              asChild
              variant={term.name === category ? 'default' : 'outline'}
              className="px-3 py-1.5 font-normal"
            >
              <Link href={term.href}>
                {term.name} {term.count}
              </Link>
            </Badge>
          ))}
        </nav>

        <div className="mt-10">
          <PostList posts={posts} />
        </div>
      </section>
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </main>
  );
}
