import Image from 'next/image';
import Link from 'next/link';
import { Github, MessageCircle } from 'lucide-react';
import logoDark from '@/asset/logo/logo-dark.png';
import logoLight from '@/asset/logo/logo-light.png';

export default function SiteFooter() {
  return (
    <footer className="flex flex-col gap-5 border-t border-border px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-14">
      <div>
        <Link className="inline-flex items-center" href="/">
          <Image src={logoLight} alt="Chaowen" width={105} height={23} className="h-auto w-[105px] dark:hidden" />
          <Image src={logoDark} alt="" width={105} height={23} aria-hidden="true" className="hidden h-auto w-[105px] dark:block" />
        </Link>
        <p className="mt-2">© 2026 Chaowen. Made with quiet care.</p>
      </div>
      <div className="flex gap-5">
        <Link href="/#关于我">关于</Link>
        <Link href="/archive">归档</Link>
        <Link href="/#标签">标签</Link>
        <a href="#">RSS</a>
      </div>
      <div className="flex items-center gap-4 text-foreground/65">
        <a aria-label="GitHub" href="#">
          <Github size={19} />
        </a>
        <a aria-label="微信" href="#">
          <MessageCircle size={19} />
        </a>
        <a
          aria-label="CSDN"
          href="#"
          className="text-[11px] font-bold tracking-normal"
        >
          CSDN
        </a>
      </div>
    </footer>
  );
}
