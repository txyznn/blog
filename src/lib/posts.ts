import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

import type {ArchiveGroup, Heading, Post, Term} from './types';

export type {ArchiveGroup, Heading, Post, Term} from './types';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const fallbackImage =
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80';

function normalizeImagePath(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return fallbackImage;
  const imagePath = value.trim().replace(/^src\/public\//, '/');
  if (imagePath.startsWith('/') || imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `/${imagePath}`;
}

const dateTimePattern =
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateTime(
    year: number,
    month: number,
    day: number,
    hours = 0,
    minutes = 0,
    seconds = 0,
): string {
  return `${year}-${padDatePart(month)}-${padDatePart(day)} ` +
      `${padDatePart(hours)}:${padDatePart(minutes)}:${padDatePart(seconds)}`;
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // gray-matter parses an unquoted `YYYY-MM-DD HH:mm:ss` value as a Date
    // whose UTC components preserve the timestamp written in frontmatter.
    return formatDateTime(
        value.getUTCFullYear(),
        value.getUTCMonth() + 1,
        value.getUTCDate(),
        value.getUTCHours(),
        value.getUTCMinutes(),
        value.getUTCSeconds(),
    );
  }

  const date = String(value ?? '').trim();
  const match = dateTimePattern.exec(date);
  if (match) {
    return formatDateTime(
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        Number(match[4] ?? 0),
        Number(match[5] ?? 0),
        Number(match[6] ?? 0),
    );
  }

  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime()) ?
      formatDateTime(
          parsed.getUTCFullYear(),
          parsed.getUTCMonth() + 1,
          parsed.getUTCDate(),
          parsed.getUTCHours(),
          parsed.getUTCMinutes(),
          parsed.getUTCSeconds(),
      ) : date;
}

function dateTimestamp(value: string): number {
  const match = dateTimePattern.exec(value);
  if (match) {
    return Date.UTC(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4] ?? 0),
        Number(match[5] ?? 0),
        Number(match[6] ?? 0),
    );
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

/**
 * frontmatter 里的 tags 可能是 YAML 数组，也可能是逗号/顿号分隔的字符串，
 * 统一归一化成去重后的字符串数组。
 */
function normalizeTags(value: unknown): string[] {
  const raw = Array.isArray(value) ?
      value :
      typeof value === 'string' ? value.split(/[,，、]/) : [];
  const seen = new Set<string>();
  for (const item of raw) {
    const tag = String(item ?? '').trim();
    if (tag) seen.add(tag);
  }
  return [...seen];
}

function normalizeCategories(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,，、]/) : [];
  return [...new Set(raw.map((item) => String(item ?? '').trim()).filter(Boolean))];
}

export function getAllPosts(): Post[] {
  return fs.readdirSync(postsDirectory)
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const source = fs.readFileSync(
            path.join(postsDirectory, fileName),
            'utf8',
        );
        const {data} = matter(source);
        return {
          slug,
          title: String(data.title ?? slug),
          excerpt: String(data.description ?? ''),
          date: normalizeDate(data.date),
          categories: normalizeCategories(data.category ?? '未分类'),
          series: typeof data.series === 'string' && data.series.trim() ? data.series.trim() : undefined,
          tags: normalizeTags(data.tags),
          image: normalizeImagePath(data.cover),
          readTime: String(data.readTime ?? '阅读 5 分钟'),
        };
      })
      .filter((post) => post.date && post.categories.length > 0)
      .sort((a, b) => dateTimestamp(b.date) - dateTimestamp(a.date));
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): Post|undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string): {previous?: Post; next?: Post} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return {};
  return {previous: posts[index + 1], next: posts[index - 1]};
}

export function getPostHeadings(slug: string): Heading[] {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return [];
  const source = fs.readFileSync(filePath, 'utf8');
  const {content} = matter(source);
  const slugger = new GithubSlugger();
  return content.split(/\r?\n/).flatMap((line) => {
    const match = /^(#{1,2})\s+(.+?)\s*$/.exec(line);
    if (!match) return [];
    const depth = match[1].length as 1 | 2;
    const text = match[2].replace(/\s+#+\s*$/, '').trim();
    return [{depth, text, id: slugger.slug(text)}];
  });
}

function toTerm(segment: string, name: string, count: number): Term {
  return {name, href: `/${segment}/${encodeURIComponent(name)}`, count};
}

/** 分类列表，按文章数倒序，文章数相同时按名称排序。 */
export function getAllCategories(): Term[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const category of post.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
      .map(([name, count]) => toTerm('category', name, count))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}

/** 标签列表，按出现次数倒序，次数相同时按名称排序。 */
export function getAllTags(): Term[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
      .map(([name, count]) => toTerm('tag', name, count))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}

/** 按年月倒序分组的归档，组内文章同样按日期倒序。 */
export function getArchive(): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>();
  for (const post of getAllPosts()) {
    const key = post.date.slice(0, 7);
    const [year, month] = key.split('-');
    if (!year || !month) continue;
    const group = groups.get(key) ?? {
      id: key,
      label: `${year} 年 ${Number(month)} 月`,
      posts: [],
    };
    // getAllPosts 已经按时间倒序，push 进组的顺序自然保持倒序。
    group.posts.push(post);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.id.localeCompare(a.id));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.categories.includes(decodeRouteParam(category)));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(decodeRouteParam(tag)));
}

export function getAllSeries(): Term[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    if (post.series) counts.set(post.series, (counts.get(post.series) ?? 0) + 1);
  }
  return [...counts.entries()]
      .map(([name, count]) => toTerm('series', name, count))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'));
}

export function getPostsBySeries(series: string): Post[] {
  const normalizedSeries = decodeRouteParam(series);
  return getAllPosts().filter((post) => post.series === normalizedSeries);
}

function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function searchPosts(query: string): Post[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];
  return getAllPosts().filter((post) =>
    [post.title, post.excerpt, post.series ?? '', ...post.categories, ...post.tags]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
}
