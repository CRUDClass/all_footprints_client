# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev          # Start dev server at http://localhost:5173
pnpm build        # Production build (vite build)
pnpm typecheck    # TypeScript type checking (vue-tsc --noEmit)
pnpm preview      # Preview production build
pnpm lint         # ESLint check
pnpm format       # Prettier format src/**/*.{ts,vue,css}
```

## Project Architecture

**Stack:** Vue 3 + Vite + Nuxt UI 4.7.1 (standalone Vue mode) + TypeScript + Pinia + Vue Router 4

```
src/
├── features/           # Domain modules (each self-contained)
│   ├── dashboard/      # 首页看板 — pages/, components/, composables/
│   └── data-import/    # 数据导入 — pages/, components/, composables/
├── shared/             # Cross-module reusable code
│   ├── components/     # Shared UI components
│   ├── composables/    # Shared Vue composables (hooks)
│   └── utils/          # Pure utility functions
├── data/               # External interaction layer
│   ├── api/            # API request wrappers
│   ├── adapters/       # Data source adapters (CSV/JSON/API)
│   └── types/          # TypeScript type definitions
├── layouts/            # Layout components (DefaultLayout.vue)
├── stores/             # Pinia global state stores
├── assets/css/         # CSS entry (Tailwind + Nuxt UI)
└── router/             # Vue Router configuration
```

## Key Patterns

- **Layout:** Top navigation (UNavigation) + content area + footer. No sidebar. Dark/light mode toggle using `useDark()`/`useToggle()` from `@vueuse/core`.
- **Routing:** Lazy-loaded routes via `() => import(...)`. Pages under `features/<module>/pages/`. Layout wraps child routes.
- **State:** Pinia composition API stores (`defineStore('name', () => { ... })`).
- **Styling:** Tailwind CSS v4 + Nuxt UI components. Use `@nuxt/ui` CSS variables like `--ui-border`, `--ui-text-muted`.
- **Nuxt UI:** Uses standalone Vite plugin (`@nuxt/ui/vite`) + Vue plugin (`@nuxt/ui/vue-plugin`). Root must wrap `<UApp>`. Components auto-imported with `U` prefix.
- **Path alias:** `@/` maps to `./src/`.

## Nuxt UI Standalone Mode Notes

- `#build/*` module stubs are declared in `src/env.d.ts` — these are Nuxt build artifacts that don't exist in Vite mode.
- `useColorMode()` from Nuxt is NOT available in standalone mode. Use `useDark()`/`useToggle()` from `@vueuse/core` instead.
- Type checking (`vue-tsc --noEmit`) is separate from build (`vite build`) due to Nuxt UI type declarations referencing Nuxt-specific modules.
- Nuxt UI generates `auto-imports.d.ts` and `components.d.ts` during first Vite build — these are gitignored.
