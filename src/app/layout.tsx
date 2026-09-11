import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chaowen Notes',
  description: '一个关于产品、阅读与生活的个人博客。',
};

/**
 * 在样式表应用前根据本地存储/系统偏好设置 `.dark`，
 * 避免首屏先渲染浅色再切换到深色。
 */
const themeScript = `
try {
  var saved = localStorage.getItem('theme');
  var isDark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) document.documentElement.classList.add('dark');
} catch (error) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
