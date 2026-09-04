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
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import logo from '../asset/logo/logo-light.png';
import avatar from '../asset/avatar.png';

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
    <main className="mx-auto my-0 max-w-[1440px] bg-white shadow-[0_18px_60px_rgba(31,52,82,.07)] md:my-7 md:rounded-[10px]">
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
          <button
            aria-label="搜索文章"
            className="rounded p-2 text-[#455168] hover:bg-[#f2f6fb]"
          >
            <Search size={19} />
          </button>
          <button
            aria-label="切换深色模式"
            className="rounded p-2 text-[#455168] hover:bg-[#f2f6fb]"
          >
            <Moon size={18} />
          </button>
          <a
            href="#newsletter"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#496b99] px-4 text-sm font-medium text-white shadow-[0_5px_12px_rgba(73,107,153,.24)] transition hover:bg-[#3e5d87]"
          >
            <Mail size={16} />
            订阅
          </a>
        </div>
        <button
          aria-label="打开导航"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded p-2 md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
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
            <a
              href="#content"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#496b99] px-5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(73,107,153,.24)] transition hover:bg-[#3e5d87]"
            >
              阅读最新文章 <ArrowRight size={16} />
            </a>
            <a
              href="#关于我"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-[#b8c8df] px-5 text-sm font-medium transition hover:border-[var(--blue)] hover:bg-white/60"
            >
              认识我 <ArrowRight size={16} />
            </a>
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
                  <span className="rounded-full bg-[#edf5ff] px-2.5 py-1 text-xs font-medium text-[var(--blue)]">
                    {post.category}
                  </span>
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
        <aside className="space-y-5">
          <section
            id="关于我"
            className="rounded-md border border-[var(--line)] p-6"
          >
            <h2 className="serif text-xl font-semibold">关于我</h2>
            <div className="mt-5 flex items-center gap-4">
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
            <a
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--blue)] hover:underline"
              href="#"
            >
              更多关于我 <ArrowRight size={15} />
            </a>
          </section>
          <section
            id="标签"
            className="rounded-md border border-[var(--line)] p-6"
          >
            <h2 className="serif text-xl font-semibold">热门标签</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag}
                  href="#"
                  className="rounded-full bg-[#f4f7fb] px-3 py-1.5 text-xs text-[#526078] transition hover:bg-[#e2efff] hover:text-[var(--blue)]"
                >
                  {tag}
                </a>
              ))}
            </div>
          </section>
          <section
            id="分类"
            className="rounded-md border border-[var(--line)] p-6"
          >
            <h2 className="serif text-xl font-semibold">文章分类</h2>
            <ul className="mt-4 space-y-3">
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
          </section>
          <section
            id="归档"
            className="rounded-md border border-[var(--line)] p-6"
          >
            <h2 className="serif text-xl font-semibold">归档</h2>
            <div className="mt-4 space-y-3 text-sm text-[#56637a]">
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
            </div>
          </section>
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
            <input
              id="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus('idle');
              }}
              type="email"
              autoComplete="email"
              className="h-11 min-w-0 flex-1 rounded-md border border-[#d7e1f0] bg-white px-3 text-sm"
              placeholder="你的邮箱地址"
            />
            <button
              disabled={status === 'loading'}
              className="h-11 shrink-0 rounded-md bg-[var(--blue)] px-5 text-sm font-medium text-white shadow-[0_6px_14px_rgba(57,123,233,.2)] transition hover:bg-[#2869d2] disabled:opacity-60"
            >
              {status === 'loading' ? '订阅中' : '订阅'}
            </button>
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
