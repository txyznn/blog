'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import logoDark from '@/asset/logo/logo-dark.png';
import logoLight from '@/asset/logo/logo-light.png';
import { Button } from '@/components/ui/button';
import MainNavigation from '@/components/MainNavigation';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

export default function SiteHeader({ sticky = false }: {sticky?: boolean}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'flex h-20 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur md:px-10',
          sticky && 'sticky top-0 z-20',
        )}
      >
        <Link className="inline-flex items-center" href="/" aria-label="返回首页">
          <Image src={logoLight} alt="Chaowen" width={118} height={26} priority className="h-auto w-[118px] dark:hidden" />
          <Image src={logoDark} alt="" width={118} height={26} priority aria-hidden="true" className="hidden h-auto w-[118px] dark:block" />
        </Link>
        <MainNavigation />
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="搜索文章"
            className="text-muted-foreground"
            asChild
          ><Link href="/search"><Search data-icon="inline-start" /></Link></Button>
          <ThemeToggle />
          <Button asChild>
            <Link href="/#newsletter"><Mail data-icon="inline-start" />订阅</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="打开导航"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>
      {isMenuOpen && (
        <MainNavigation mobile onNavigate={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
