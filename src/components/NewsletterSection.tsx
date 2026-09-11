'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 500);
  };

  return (
    <section id="newsletter" className="mx-5 mb-10 grid gap-6 rounded-lg border border-border bg-accent px-6 py-8 md:mx-14 md:grid-cols-[1fr_auto] md:items-center md:px-9">
      <div className="flex gap-4">
        <div className="hidden size-11 shrink-0 place-items-center rounded-full bg-background text-primary sm:grid"><Send size={20} /></div>
        <div>
          <h2 className="serif text-2xl font-semibold">订阅我的来信</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">每月一封，分享最近的阅读、思考与生活碎片。</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full md:w-[360px]">
        <label className="sr-only" htmlFor="email">邮箱地址</label>
        <div className="flex gap-2">
          <Input id="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle'); }} type="email" autoComplete="email" className="h-11 bg-background" placeholder="你的邮箱地址" />
          <Button type="submit" size="lg" disabled={status === 'loading'} className="shadow-sm">{status === 'loading' ? '订阅中' : '订阅'}</Button>
        </div>
        <p aria-live="polite" className={cn('mt-2 text-xs', status === 'error' ? 'text-destructive' : 'text-success')}>
          {status === 'success' ? '订阅成功，下一封来信见。' : status === 'error' ? '请输入有效的邮箱地址。' : ''}
        </p>
      </form>
    </section>
  );
}
