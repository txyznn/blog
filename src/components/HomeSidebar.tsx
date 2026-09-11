import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import avatar from '@/asset/avatar.png';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArchiveGroup, Term } from '@/lib/types';

const sidebarLimits = { categories: 6, tags: 12, archive: 4 };

export default function HomeSidebar({
  tags,
  categories,
  archive,
}: {
  tags: Term[];
  categories: Term[];
  archive: ArchiveGroup[];
}) {
  return (
    <aside className="flex flex-col gap-5">
      <Card id="关于我">
        <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">关于我</CardTitle></CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Image className="rounded-full" src={avatar} alt="Chaowen 的头像" width={62} height={62} />
            <p className="text-sm leading-6 text-muted-foreground">
              程序员 / 博客作者
              <br />
              这个人很懒，什么都没留下
            </p>
          </div>
          <a className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" href="#">
            更多关于我 <ArrowRight data-icon="inline-end" />
          </a>
        </CardContent>
      </Card>

      <Card id="标签">
        <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">热门标签</CardTitle></CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, sidebarLimits.tags).map((tag) => (
              <Badge key={tag.name} asChild variant="outline" className="bg-muted px-3 py-1.5 font-normal text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Link href={tag.href}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card id="分类">
        <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">文章分类</CardTitle></CardHeader>
        <CardContent className="p-6">
          <ul className="flex flex-col gap-3">
            {categories.slice(0, sidebarLimits.categories).map((category, index) => (
              <li key={category.name} className="flex items-center justify-between text-sm">
                <Link className="flex items-center gap-2 transition-colors hover:text-primary" href={category.href}>
                  <span className={`size-2 rounded-full ${['bg-chart-1', 'bg-chart-2', 'bg-chart-4', 'bg-chart-5'][index % 4]}`} />
                  {category.name}
                </Link>
                <span className="text-muted-foreground">{category.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card id="归档">
        <CardHeader className="p-6 pb-0"><CardTitle className="serif text-xl">归档</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 p-6 text-sm text-muted-foreground">
          {archive.slice(0, sidebarLimits.archive).map((group) => (
            <Link key={group.id} className="flex justify-between transition-colors hover:text-primary" href={`/archive#${group.id}`}>
              <span>{group.label}</span>
              <span>{group.posts.length}</span>
            </Link>
          ))}
          <Link className="mt-1 inline-flex items-center gap-1 font-medium text-primary hover:underline" href="/archive">
            全部归档 <ArrowRight data-icon="inline-end" />
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
