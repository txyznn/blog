import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Tag } from 'lucide-react';
import { getAdjacentPosts, getPostBySlug, getPostHeadings, getPostSlugs } from '../../../lib/posts';
import logoLight from '../../../asset/logo/logo-light.png';
import logoDark from '../../../asset/logo/logo-dark.png';
import TableOfContents from '../../../components/TableOfContents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} | Chaowen`, description: post.excerpt };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { previous, next } = getAdjacentPosts(slug);
  const headings = getPostHeadings(slug);
  const Article = (await import(`../../../content/posts/${slug}.mdx`)).default;
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="/" aria-label="返回首页" className="inline-flex items-center">
            <Image src={logoLight} alt="Chaowen" width={118} height={26} priority className="h-auto w-[106px] dark:hidden" />
            <Image src={logoDark} alt="" width={118} height={26} priority aria-hidden="true" className="hidden h-auto w-[106px] dark:block" />
          </a>
          <Button asChild variant="ghost"><a href="/"><ArrowLeft data-icon="inline-start" />返回首页</a></Button>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-20">
          <TableOfContents headings={headings} />
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <header className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-2">
              {post.categories.map((category) => <Badge key={category} variant="secondary" className="gap-1.5"><Tag data-icon="inline-start" />{category}</Badge>)}
            </div>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{post.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{post.readTime}</span>
          </div>
          <h1 className="serif mt-7 text-4xl font-bold leading-[1.2] tracking-tight text-foreground md:text-5xl">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{post.excerpt}</p>
        </header>

        <div className="relative mx-auto mt-12 aspect-[16/7] max-w-4xl overflow-hidden rounded-xl bg-accent shadow-lg md:mt-16">
          <Image src={post.image} alt="" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 960px" />
        </div>

        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <div className="article-body">
            <Article />
          </div>
        </div>

        <footer className="mx-auto mt-16 max-w-3xl border-t border-border pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {previous ? (
              <a href={`/posts/${previous.slug}`} className="group rounded-md border border-border p-4 transition-colors hover:bg-blue-200">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft size={14} />上一篇</span>
                <span className="mt-2 block font-medium text-foreground">{previous.title}</span>
              </a>
            ) : <span />}
            {next ? (
              <a href={`/posts/${next.slug}`} className="group rounded-md border border-border p-4 text-right transition-colors hover:bg-blue-200">
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">下一篇<ArrowRight size={14} /></span>
                <span className="mt-2 block font-medium text-foreground">{next.title}</span>
              </a>
            ) : null}
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>感谢阅读</span>
            <Button asChild variant="link" className="h-auto p-0"><a href="/"><ArrowLeft data-icon="inline-start" />返回文章列表</a></Button>
          </div>
        </footer>
          </div>
        </div>
      </article>
    </main>
  );
}
