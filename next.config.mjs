import createMDX from '@next/mdx';

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  devIndicators: { position: 'bottom-left' },
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.14.245'],
  experimental: { useTypeScriptCli: false },
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
