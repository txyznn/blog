import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';

export default function PostList({
  posts,
  emptyText = '这里还没有文章。',
  firstAccent = true,
}: {
  posts: Post[];
  emptyText?: string;
  /** 列表首篇是否用主色上边框强调，分组列表里通常关掉。 */
  firstAccent?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <p className="border-t-2 border-primary py-10 text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <div>
      {posts.map((post, index) => (
        <article
          key={post.slug}
          className={cn(
            'grid gap-5 border-t border-border py-5 sm:grid-cols-[190px_1fr]',
            firstAccent && index === 0 && 'border-t-2 border-primary',
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 190px"
              className="object-cover"
            />
          </div>
          <div className="py-1">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => <Badge key={category} variant="secondary">{category}</Badge>)}
            </div>
            <h3 className="mt-3 text-xl font-semibold leading-7 tracking-normal">
              <Link
                className="transition-colors hover:text-primary"
                href={`/posts/${post.slug}`}
              >
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {post.excerpt}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {post.date}
              <span className="mx-2">·</span>
              {post.readTime}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
