import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

import type {Post} from '../app/HomeClient';

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

export type Heading = {
  depth: 1|2; text: string; id: string;
};

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
          date: String(data.date ?? ''),
          category: String(data.category ?? '未分类'),
          image: normalizeImagePath(data.cover),
          readTime: String(data.readTime ?? '阅读 5 分钟'),
        };
      })
      .filter((post) => post.date && post.category)
      .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): Post|undefined {
  return getAllPosts().find((post) => post.slug === slug);
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
