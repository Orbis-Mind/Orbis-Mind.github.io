# Orbis-Mind.github.io

The official website for **[Orbis Mind](https://orbis-mind.github.io/)** — building the
infrastructure layer for intelligent software.

**Live at https://orbis-mind.github.io**

## Stack

Built with **[Astro](https://astro.build)** + TypeScript. Component-based, markdown-driven
blog (content collections + RSS), sitemap, strict typing, and a hand-crafted design system —
no UI framework, no runtime JavaScript dependencies, in keeping with how Orbis Mind ships
software. Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.

```
src/
├── components/     BrandMark, Nav, Footer
├── layouts/        Base.astro (head, theme, nav, footer, scripts)
├── content/blog/   Markdown posts (content collection)
├── content.config.ts
├── pages/
│   ├── index.astro        Home
│   ├── aether.astro       Flagship product
│   ├── optiflow.astro     OptiFlow
│   ├── docs.astro         Aether documentation
│   ├── blog/              Blog index + [...slug] post template
│   ├── rss.xml.ts         RSS feed
│   └── 404.astro
└── styles/global.css      Design system (light + dark)
public/                     favicon.svg, .nojekyll
```

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview    # preview the production build
```

## Writing a post

Add a Markdown file to `src/content/blog/`:

```markdown
---
title: "Your title"
description: "One-sentence summary used in listings and meta tags."
date: 2026-11-20
tag: Engineering
author: Orbis Mind
readingTime: "5 min read"
---

Body in Markdown…
```

It appears automatically in the blog index and the RSS feed.

## Projects featured

- **Aether** — https://github.com/Orbis-Mind/aether
- **OptiFlow** — https://github.com/Orbis-Mind/optiflow

© 2026 Orbis Mind · MIT Licensed
