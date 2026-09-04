'use client';

import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Github,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Send,
  Sun,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import logo from '../asset/logo/logo-light.png';
import avatar from '../asset/avatar.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
};

const tags = [
  '产品思考',
  '阅读',
  '日常',
  '创作',
  '旅行',
  '设计',
  '效率',
  '播客',
];
const categories = [
  ['设计', '12'],
  ['随笔', '18'],
  ['生活', '15'],
  ['阅读', '9'],
];

export default function Home({ posts }: { posts: Post[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const shouldUseDark = savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);
  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle('dark', nextIsDark);
    window.localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 500);
  };
  const navItems = ['首页', '文章', '分类', '标签', '关于我', '归档'];

  return (
    <main data-theme={isDark ? 'dark' : 'light'} className={`mx-auto my-0 max-w-[1440px] bg-white shadow-[0_18px_60px_rgba(31,52,82,.07)] md:my-7 md:rounded-[10px] ${isDark ? 'theme-dark' : ''}`}>
      <a href="#content" className="sr-only focus:not-sr-only">
        跳到正文
      </a>
      <header className="flex h-20 items-center justify-between border-b border-[var(--line)] px-5 md:px-10">
        <a className="inline-flex items-center" href="#">
          <Image
            src={logo}
            alt="Chaowen"
            width={118}
            height={26}
            priority
            className="h-auto w-[118px]"
          />
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="主导航">
          {navItems.map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-[#3b4558] transition hover:text-[var(--blue)]"
              href={item === '首页' ? '#' : `#${item}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="搜索文章"
            className="text-[#455168]"
          >
            <Search data-icon="inline-start" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
            aria-pressed={isDark}
            onClick={toggleTheme}
            className="text-[#455168]"
          >
            {isDark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
          </Button>
          <Button asChild className="bg-[#496b99] shadow-[0_5px_12px_rgba(73,107,153,.24)] hover:bg-[#3e5d87]">
            <a href="#newsletter"><Mail data-icon="inline-start" />订阅</a>
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
        <nav
          className="border-b border-[var(--line)] px-5 py-4 md:hidden"
          aria-label="移动导航"
        >
          {navItems.map((item) => (
            <a
              key={item}
              onClick={() => setIsMenuOpen(false)}
              className="block rounded px-3 py-3 text-sm hover:bg-[#f1f6ff]"
              href={item === '首页' ? '#' : `#${item}`}
            >
              {item}
            </a>
          ))}
        </nav>
      )}

      <section className="hero-bg min-h-[490px] px-7 py-20 md:min-h-[525px] md:px-16 md:py-28">
        <div className="max-w-[510px]">
          <p className="mb-5 text-sm font-semibold text-[var(--blue)]">
            HELLO, I&apos;M CHAOWEN
          </p>
          <h1 className="serif text-[48px] font-semibold leading-[1.12] md:text-[68px]">
            <span className="block">数据驱动</span>
            <span className="block">世界引擎</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-[#42516a]">
            From Simulation to Reality.
            <br />
            从仿真出发，走向真实世界。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#496b99] shadow-[0_8px_18px_rgba(73,107,153,.24)] hover:bg-[#3e5d87]"><a href="#content">阅读最新文章 <ArrowRight data-icon="inline-end" /></a></Button>
            <Button asChild size="lg" variant="outline" className="border-[#b8c8df] bg-transparent hover:border-[var(--blue)] hover:bg-white/60"><a href="#关于我">认识我 <ArrowRight data-icon="inline-end" /></a></Button>
          </div>
          <div className="mt-10 flex items-center gap-5 text-[#3f4d61]">
            <a aria-label="GitHub" href="#">
              <Github size={20} />
            </a>
            <a aria-label="微信" href="#">
              <MessageCircle size={20} />
            </a>
            <a
              aria-label="CSDN"
              href="#"
              className="text-xs font-bold tracking-normal"
            >
              CSDN
            </a>
          </div>
        </div>
      </section>

      <div
        id="content"
        className="grid gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:px-14"
      >
        <section>
          <div className="mb-7 flex items-center justify-between">
            <h2 className="serif text-2xl font-semibold">最新文章</h2>
            <a
              className="inline-flex items-center gap-1 text-sm text-[#536178] hover:text-[var(--blue)]"
              href="#文章"
            >
              查看全部 <ChevronRight size={16} />
            </a>
          </div>
          <div>
            {posts.map((post) => (
              <article
                key={post.slug}
                className="grid gap-5 border-t border-[var(--line)] py-5 first:border-t-2 first:border-[var(--blue)] sm:grid-cols-[190px_1fr]"
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
                  <Badge variant="secondary" className="bg-[#edf5ff] text-[var(--blue)]">{post.category}</Badge>
                  <h3 className="mt-3 text-xl font-semibold leading-7 tracking-normal">
                    <a
                      className="hover:text-[var(--blue)]"
                      href={`/posts/${post.slug}`}
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-[#7c8799]">
                    {post.date}
                    <span className="mx-2">·</span>
                    {post.readTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <aside className="flex flex-col gap-5">
          <Card id="关于我" className="rounded-md border-[var(--line)] shadow-none">
            <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">关于我</CardTitle></CardHeader>
            <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Image
                className="rounded-full"
                src={avatar}
                alt="Chaowen 的头像"
                width={62}
                height={62}
              />
              <p className="text-sm leading-6 text-[var(--muted)]">
                程序员 / 博客作者
                <br />
                这个人很懒，什么都没留下
              </p>
            </div>
            <a className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--blue)] hover:underline" href="#">更多关于我 <ArrowRight /></a>
            </CardContent>
          </Card>
          <Card id="标签" className="rounded-md border-[var(--line)] shadow-none">
            <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">热门标签</CardTitle></CardHeader>
            <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} asChild variant="outline" className="border-transparent bg-[#f4f7fb] px-3 py-1.5 font-normal text-[#526078] hover:bg-[#e2efff] hover:text-[var(--blue)]"><a href="#">{tag}</a></Badge>
              ))}
            </div>
            </CardContent>
          </Card>
          <Card id="分类" className="rounded-md border-[var(--line)] shadow-none">
            <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">文章分类</CardTitle></CardHeader>
            <CardContent className="p-6">
            <ul className="flex flex-col gap-3">
              {categories.map(([name, count], index) => (
                <li
                  key={name}
                  className="flex items-center justify-between text-sm"
                >
                  <a
                    className="flex items-center gap-2 hover:text-[var(--blue)]"
                    href="#"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${['bg-[#5088ed]', 'bg-[#64b9a7]', 'bg-[#f39a71]', 'bg-[#9d8dde]'][index]}`}
                    />
                    {name}
                  </a>
                  <span className="text-[#8b96a6]">{count}</span>
                </li>
              ))}
            </ul>
            </CardContent>
          </Card>
          <Card id="归档" className="rounded-md border-[var(--line)] shadow-none">
            <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">归档</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 p-6 text-sm text-[#56637a]">
              <a
                className="flex justify-between hover:text-[var(--blue)]"
                href="#"
              >
                <span>2024 年 6 月</span>
                <span>4</span>
              </a>
              <a
                className="flex justify-between hover:text-[var(--blue)]"
                href="#"
              >
                <span>2024 年 5 月</span>
                <span>7</span>
              </a>
              <a
                className="flex justify-between hover:text-[var(--blue)]"
                href="#"
              >
                <span>2024 年 4 月</span>
                <span>5</span>
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>
      <section
        id="newsletter"
        className="mx-5 mb-10 grid gap-6 rounded-md bg-[#edf5ff] px-6 py-8 md:mx-14 md:grid-cols-[1fr_auto] md:items-center md:px-9"
      >
        <div className="flex gap-4">
          <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[var(--blue)] sm:grid">
            <Send size={20} />
          </div>
          <div>
            <h2 className="serif text-2xl font-semibold">订阅我的来信</h2>
            <p className="mt-1 text-sm leading-6 text-[#596982]">
              每月一封，分享最近的阅读、思考与生活碎片。
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-[360px]">
          <label className="sr-only" htmlFor="email">
            邮箱地址
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus('idle');
              }}
              type="email"
              autoComplete="email"
              className="h-11 border-[#d7e1f0] bg-white"
              placeholder="你的邮箱地址"
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className="bg-[var(--blue)] shadow-[0_6px_14px_rgba(57,123,233,.2)] hover:bg-[#2869d2]"
            >
              {status === 'loading' ? '订阅中' : '订阅'}
            </Button>
          </div>
          <p
            aria-live="polite"
            className={`mt-2 text-xs ${status === 'error' ? 'text-red-600' : 'text-[#33745c]'}`}
          >
            {status === 'success'
              ? '订阅成功，下一封来信见。'
              : status === 'error'
                ? '请输入有效的邮箱地址。'
                : ''}
          </p>
        </form>
      </section>
      <footer className="flex flex-col gap-5 border-t border-[var(--line)] px-5 py-8 text-sm text-[#718096] md:flex-row md:items-center md:justify-between md:px-14">
        <div>
          <a className="inline-flex items-center" href="#">
            <Image
              src={logo}
              alt="Chaowen"
              width={105}
              height={23}
              className="h-auto w-[105px]"
            />
          </a>
          <p className="mt-2">© 2026 Chaowen. Made with quiet care.</p>
        </div>
        <div className="flex gap-5">
          <a href="#">关于</a>
          <a href="#">友链</a>
          <a href="#">隐私</a>
          <a href="#">RSS</a>
        </div>
        <div className="flex items-center gap-4 text-[#4c5b6f]">
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
    </main>
  );
}
