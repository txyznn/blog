'use client';

import { List, X } from 'lucide-react';
import { useState } from 'react';
import type { Heading } from '../lib/posts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);
  if (headings.length === 0) return null;

  return (
    <>
      <div className="mb-6 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={isOpen}
          aria-controls="mobile-article-toc"
          onClick={() => setIsOpen((open) => !open)}
          className="border-border bg-background text-foreground hover:border-primary hover:text-primary"
        >
          {isOpen ? <X data-icon="inline-start" /> : <List data-icon="inline-start" />}
          文章目录
        </Button>
        {isOpen && (
          <nav id="mobile-article-toc" aria-label="文章目录" className="mt-3 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-2.5">
              {headings.map((heading) => (
                <a key={heading.id} href={`#${heading.id}`} onClick={() => setIsOpen(false)} className={cn('block text-sm leading-6 text-muted-foreground transition-colors hover:text-primary', heading.depth === 2 ? 'pl-4' : 'font-medium text-foreground/70')}>
                  {heading.text}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>

      <aside className="hidden lg:col-start-2 lg:row-start-1 lg:block">
        <div className="sticky top-24 border-l border-border pl-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">文章目录</p>
          <nav aria-label="文章目录" className="flex flex-col gap-2">
            {headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`} className={cn('block text-sm leading-6 text-muted-foreground transition-colors hover:text-primary', heading.depth === 2 ? 'pl-3' : 'font-medium text-foreground/70')}>
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
