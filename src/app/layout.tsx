import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chaowen Notes',
  description: '一个关于产品、阅读与生活的个人博客。',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
