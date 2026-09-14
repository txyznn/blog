'use client';

import { Check, Copy } from 'lucide-react';
import { type ComponentPropsWithoutRef, type ReactNode, Children, isValidElement, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CodeElementProps = { className?: string; children?: ReactNode };

type CodeBlockProps = ComponentPropsWithoutRef<'pre'>;

const languageLabels: Record<string, string> = {
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  cpp: 'C++',
  c: 'C',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  markdown: 'Markdown',
  md: 'Markdown',
  text: 'Text',
  plaintext: 'Text',
  typescript: 'TypeScript',
  ts: 'TypeScript',
};

function getLanguage(children: ReactNode): string {
  const codeElement = Children.toArray(children).find((child) => isValidElement<CodeElementProps>(child));
  if (!isValidElement<CodeElementProps>(codeElement)) return 'Text';
  const className = codeElement.props.className ?? '';
  const language = className.split(' ').find((name) => name.startsWith('language-'))?.slice(9);
  return languageLabels[language ?? ''] ?? language ?? 'Text';
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const language = getLanguage(children);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      const code = preRef.current?.querySelector('code')?.textContent ?? preRef.current?.textContent ?? '';
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    timerRef.current = setTimeout(() => setStatus('idle'), 2500);
  };

  return (
    <div className="code-block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border bg-muted px-3 text-xs text-muted-foreground">
        <span className="font-medium tracking-wide">{language}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={status === 'copied' ? '已复制代码' : '复制代码'}
        >
          {status === 'copied' ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          <span>{status === 'copied' ? '已复制' : '复制'}</span>
        </Button>
      </div>
      <pre {...props} ref={preRef} tabIndex={0} aria-label={`${language} 代码，可横向滚动`} className={cn(className)}>
        {children}
      </pre>
      <div role="status" className={status === 'error' ? 'px-4 pb-3 text-sm text-destructive' : 'sr-only'}>
        {status === 'copied' ? '代码已复制到剪贴板' : status === 'error' ? '复制失败，请选中代码手动复制；自动复制需要 HTTPS 或 localhost。' : ''}
      </div>
    </div>
  );
}
