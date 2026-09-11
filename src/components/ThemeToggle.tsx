'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <Button variant="ghost" size="icon" aria-label="切换深浅色主题" onClick={toggleTheme} className="text-muted-foreground">
      <Sun data-icon="inline-start" className="dark:hidden" />
      <Moon data-icon="inline-start" className="hidden dark:block" />
    </Button>
  );
}
