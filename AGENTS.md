<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 文章日期规范

- 新增文章时，Frontmatter 的 `date` 必须采用 `YYYY-MM-DD HH:mm:ss` 格式，精确到秒，不得只填写年月日。
- 日期时间统一使用北京时间（`Asia/Shanghai`），例如 `date: 2026-09-14 11:42:47`。
- 用户指定发布时间时以用户提供的时间为准；未指定时，读取当前北京时间，不凭空填写时分秒。
- 修改已有文章时保留原发布时间，除非用户明确要求更新。
