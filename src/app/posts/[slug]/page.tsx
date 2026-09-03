import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock3, Tag } from 'lucide-react';
import { getPostBySlug, getPostHeadings, getPostSlugs } from '../../../lib/posts';
import logo from '../../../asset/logo/logo-light.png';
import TableOfContents from '../../../components/TableOfContents';

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
  const headings = getPostHeadings(slug);
  const Article = (await import(`../../../content/posts/${slug}.mdx`)).default;
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="/" aria-label="返回首页" className="inline-flex items-center">
            <Image src={logo} alt="Chaowen" width={118} height={26} priority className="h-auto w-[106px]" />
          </a>
          <a href="/" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--blue-pale)] hover:text-[var(--blue)]">
            <ArrowLeft size={16} /> 返回首页
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-20">
          <TableOfContents headings={headings} />
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <header className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--blue)]"><Tag size={14} />{post.category}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{post.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{post.readTime}</span>
          </div>
          <h1 className="serif mt-7 text-4xl font-bold leading-[1.2] tracking-tight text-[var(--ink)] md:text-5xl">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">{post.excerpt}</p>
        </header>

        <div className="relative mx-auto mt-12 aspect-[16/7] max-w-4xl overflow-hidden rounded-xl bg-[var(--blue-pale)] shadow-[0_16px_40px_rgba(42,76,120,.12)] md:mt-16">
          <Image src={post.image} alt="" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 960px" />
        </div>

        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <div className="article-body">
            <Article />
          </div>
        </div>

        <footer className="mx-auto mt-16 flex max-w-3xl items-center justify-between border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]">
          <span>感谢阅读</span>
          <a href="/" className="inline-flex items-center gap-2 font-medium text-[var(--blue)] hover:underline"><ArrowLeft size={15} /> 返回文章列表</a>
        </footer>
          </div>
        </div>
      </article>
    </main>
  );
}
