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

**Stack:** Vue 3 + Vite + Nuxt UI 4.7.1 (standalone Vue mode) + TypeScript + Pinia + Vue Router 4 + TanStack Table (`@tanstack/vue-table`)

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
- **UTable columns:** Column definitions must use `accessorKey` (data field) and `header` (display text), not `key`/`label`. Type with `ColumnDef<T>[]` from `@tanstack/vue-table`. Example: `const columns: ColumnDef<BillRecord>[] = [{ accessorKey: 'tradeTime', header: '交易时间' }]`.
- **类型约束：** 当第三方库（如 chart.js、@tanstack/vue-table、@nuxt/ui 等）提供了明确的类型时（如 `ChartOptions<'line'>`、`ColumnDef<T>`、`NavigationMenuItem`），变量声明必须使用该类型，不允许依赖 TypeScript 自动推断或手写不兼容的类型标注。
- **Path alias:** `@/` maps to `./src/`.
- **API Loading:** 所有 API 调用必须使用 `shared/composables/useLoading.ts` 提供的 `useLoading(fn, { minDuration: 1000 })` composable，保证 loading 状态至少显示 1s。不要在组件或业务 composable 中手动管理 `loading = ref(true/false)`。加载态视觉反馈优先使用 `UTable :loading`、`UButton :loading` 或 `<USkeleton>` 组件。

## Nuxt UI 组件使用规则

- 使用 Nuxt UI 组件时（如 `UTable`、`UButton`、`UPagination` 等），必须先通过 `nuxt-ui` MCP 服务的工具（如 `get-component`、`get-component-metadata`、`search-documentation` 等）查阅官方文档，了解组件的 Props、Slots、类型定义以及 v4 版本的差异，再编写代码。

## Nuxt UI Standalone Mode Notes

- `#build/*` module stubs are declared in `src/env.d.ts` — these are Nuxt build artifacts that don't exist in Vite mode.
- `useColorMode()` from Nuxt is NOT available in standalone mode. Use `useDark()`/`useToggle()` from `@vueuse/core` instead.
- Type checking (`vue-tsc --noEmit`) is separate from build (`vite build`) due to Nuxt UI type declarations referencing Nuxt-specific modules.
- Nuxt UI generates `auto-imports.d.ts` and `components.d.ts` during first Vite build — these are gitignored.
