import type { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://txyznn.xyz';
  const routes = ['/', '/archive', '/search'];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}` })),
    ...getAllPosts().map((post) => ({ url: `${baseUrl}/posts/${post.slug}`, lastModified: new Date(post.date.replace(' ', 'T') + '+08:00') })),
    ...getAllCategories().map((term) => ({ url: `${baseUrl}${term.href}` })),
    ...getAllTags().map((term) => ({ url: `${baseUrl}${term.href}` })),
  ];
}
