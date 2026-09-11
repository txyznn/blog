export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  categories: string[];
  series?: string;
  tags: string[];
  image: string;
  readTime: string;
};

export type Heading = {
  depth: 1|2; text: string; id: string;
};

/** 分类或标签，`name` 是原文，`href` 是已经转义好的站内路径。 */
export type Term = {
  name: string; href: string; count: number;
};

/** 按年月聚合的归档分组，`id` 同时用作页面锚点。 */
export type ArchiveGroup = {
  id: string; label: string; posts: Post[];
};
