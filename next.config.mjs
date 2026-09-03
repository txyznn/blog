import createMDX from '@next/mdx';

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default createMDX({
  options: {
    // Use package names so Turbopack can serialize loader options.
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
    rehypePlugins: ['rehype-slug'],
  },
})(nextConfig);
