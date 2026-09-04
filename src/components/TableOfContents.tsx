'use client';

import { List, X } from 'lucide-react';
import { useState } from 'react';
import type { Heading } from '../lib/posts';
import { Button } from '@/components/ui/button';

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
          className="border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
        >
          {isOpen ? <X data-icon="inline-start" /> : <List data-icon="inline-start" />}
          文章目录
        </Button>
        {isOpen && (
          <nav id="mobile-article-toc" aria-label="文章目录" className="mt-3 rounded-lg border border-[var(--line)] bg-[#fbfdff] p-4">
            <div className="flex flex-col gap-2.5">
              {headings.map((heading) => (
                <a key={heading.id} href={`#${heading.id}`} onClick={() => setIsOpen(false)} className={`block text-sm leading-6 text-[#91a0b5] transition hover:text-[var(--blue)] ${heading.depth === 2 ? 'pl-4' : 'font-medium text-[#7f8da2]'}`}>
                  {heading.text}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>

      <aside className="hidden lg:col-start-2 lg:row-start-1 lg:block">
        <div className="sticky top-24 border-l border-[var(--line)] pl-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">文章目录</p>
          <nav aria-label="文章目录" className="flex flex-col gap-2">
            {headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`} className={`block text-sm leading-6 text-[#91a0b5] transition hover:text-[var(--blue)] ${heading.depth === 2 ? 'pl-3' : 'font-medium text-[#7f8da2]'}`}>
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
