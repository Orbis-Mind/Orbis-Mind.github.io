# Orbis-Mind.github.io

The official website for **[Orbis Mind](https://orbis-mind.github.io/)** — building the
infrastructure layer for intelligent software.

Live at **https://orbis-mind.github.io**

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Company overview, live projects, engineering principles |
| Aether | `aether.html` | Flagship AI Workload Compiler + Execution Runtime |
| OptiFlow | `optiflow.html` | Self-optimizing runtime for AI workflow graphs |
| Docs | `docs.html` | Full Aether documentation (architecture, pillars, inventory, roadmap) |

## Stack

Hand-built static HTML/CSS/JS — **no framework, no build step, zero runtime dependencies**,
in keeping with how Orbis Mind ships software. Fonts are served from Google Fonts; everything
else is local. Deployed straight from `main` via GitHub Pages (`.nojekyll`).

```
.
├── index.html
├── aether.html
├── optiflow.html
├── docs.html
├── favicon.svg
└── assets/
    ├── styles.css
    └── app.js
```

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Projects

- **Aether** — https://github.com/Orbis-Mind/aether
- **OptiFlow** — https://github.com/Orbis-Mind/optiflow

© 2026 Orbis Mind · MIT Licensed
