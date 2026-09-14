# MDX 写作说明

## 文章目录

所有文章源文件统一放在：

```text
src/content/posts/
```

`posts` 是文章内容的统一入口，不按分类拆成多个物理目录。文件名建议使用英文短横线，例如：

```text
ros2-cross-compile-notes.mdx
kv-cache-explained.mdx
```

## Frontmatter

每篇文章顶部使用 YAML frontmatter 描述文章元数据：

```md
---
title: ROS2 交叉编译踩坑记录
date: 2026-09-03
description: 记录工具链、依赖和目标平台配置中的问题与解决方案。
category: 技术复盘
tags:
  - ROS2
  - 交叉编译
  - 工程实践
---
```

正文从第二个 `---` 后开始，可以使用标准 Markdown，也可以嵌入 MDX/React 组件。

## 分类与标签

- `category`：每篇文章选择一个主分类，用于分类页和内容统计。
- `series`：可选，同一系列文章填写完全一致的专栏名称，例如 `ROS 入门到进阶`。
- `tags`：每篇文章可以有多个标签，用于跨分类检索和相关推荐。
- 分类保持稳定、数量较少；标签可以更具体、更灵活。

文章分类方案见 `docs/04-content/内容规划.md`。

## 代码块

使用三个反引号包裹代码，并在开头注明语言，例如 `bash`、`cpp`、`json`、`javascript` 或 `typescript`。代码块自动显示语言栏、一键复制按钮和跟随网站主题切换的语法配色，不需要修改文章组件。

````md
```bash
source /opt/ros/humble/setup.bash
ros2 topic list
```
````

纯文本流程图请使用 `text`，保留等宽对齐且不加语法配色。未指定或不支持的语言会回退为纯文本。长行保持原样，通过横向滚动阅读；复制保留换行和缩进，不包含工具栏内容。自动复制需要 HTTPS 或 localhost，失败时页面会提示手动复制。
