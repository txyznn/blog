import { getAllPosts } from '@/lib/posts';

export function GET() {
  const siteUrl = 'https://txyznn.xyz';
  const items = getAllPosts().map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid>${siteUrl}/posts/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date.replace(' ', 'T') + '+08:00').toUTCString()}</pubDate>
    </item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Chaowen Notes</title><link>${siteUrl}</link><description>一个关于产品、阅读与生活的个人博客。</description>${items}
</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
