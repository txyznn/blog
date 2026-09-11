import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const navItems = [
  { label: '首页', href: '/' },
  { label: '文章', href: '/#content' },
  { label: '分类', href: '/#分类' },
  { label: '标签', href: '/#标签' },
  { label: '关于我', href: '/#关于我' },
  { label: '归档', href: '/archive' },
];

export default function MainNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className={mobile ? 'border-b border-border px-5 py-4 md:hidden' : 'hidden items-center gap-8 lg:flex'}
      aria-label={mobile ? '移动导航' : '主导航'}
    >
      {navItems.map((item) => {
        const isCurrent = item.href === '/archive' ? pathname === '/archive' : item.href === '/' && pathname === '/';
        return (
          <Link
            key={item.label}
            onClick={onNavigate}
            className={cn(
              mobile
                ? 'block rounded-md px-3 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
                : 'text-sm font-medium transition-colors hover:text-primary',
              !mobile && (isCurrent ? 'text-primary' : 'text-foreground/75'),
            )}
            aria-current={isCurrent ? 'page' : undefined}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
