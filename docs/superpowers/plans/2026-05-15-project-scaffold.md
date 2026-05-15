# 万象数迹 项目初始化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 Vue 3 + Vite + Nuxt UI 4.7.1 + TypeScript 项目脚手架，含路由、布局、状态管理框架。

**Architecture:** 模块化单页应用（SPA），顶部导航 + 内容区布局，无侧边栏。功能模块按 features 组织，跨模块共享代码放 shared/，数据层放 data/。

**Tech Stack:** Vue 3, Vite, TypeScript, Nuxt UI 4.7.1, Tailwind CSS v4, vue-router 4, Pinia, ESLint, Prettier

---

## 文件映射

| 文件 | 角色 |
|---|---|
| `package.json` | 项目依赖与脚本 |
| `vite.config.ts` | Vite 构建配置 + Nuxt UI 插件 + 路径别名 |
| `tsconfig.json` | TypeScript 基础配置 |
| `tsconfig.app.json` | 应用代码 TS 配置（含路径别名） |
| `tsconfig.node.json` | Node 端配置（vite.config.ts 等） |
| `eslint.config.js` | ESLint 扁平化配置 |
| `prettier.config.js` | Prettier 格式化配置 |
| `.gitignore` | Git 忽略规则 |
| `index.html` | HTML 入口 + isolate 容器 |
| `src/env.d.ts` | Vue SFC 及自动导入类型声明 |
| `src/main.ts` | 应用入口：createApp + router + pinia + ui plugin |
| `src/App.vue` | 根组件：`<UApp>` + `<RouterView>` |
| `src/assets/css/main.css` | Tailwind + Nuxt UI CSS 入口 |
| `src/router/index.ts` | 路由配置：首页 / 数据导入 |
| `src/stores/index.ts` | Pinia 根 store 导出 |
| `src/data/types/index.ts` | 基础 TS 类型定义 |
| `src/shared/utils/index.ts` | 工具函数出口 |
| `src/layouts/DefaultLayout.vue` | 顶部导航 + 内容区 + 页脚布局 |
| `src/features/dashboard/pages/DashboardPage.vue` | 首页看板占位页 |
| `src/features/data-import/pages/DataImportPage.vue` | 数据导入占位页 |

---

### Task 1: 初始化 package.json 与基础配置

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1.1: 创建 package.json**

```json
{
  "name": "all-footprints-client",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "description": "万象数迹 - 个人数据管理系统",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{ts,vue,css}\""
  },
  "dependencies": {
    "@nuxt/ui": "^4.7.1",
    "pinia": "^3.0.0",
    "vue": "^3.5.0",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "eslint": "^9.0.0",
    "prettier": "^3.5.0",
    "tailwindcss": "^4.1.0",
    "typescript": "~5.8.0",
    "vite": "^6.3.0",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 1.2: 创建 .gitignore**

```
# Dependencies
node_modules/

# Build
dist/

# Auto-generated type declarations (Nuxt UI)
auto-imports.d.ts
components.d.ts

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.*.local

# Debug
logs/
*.log
```

- [ ] **Step 1.3: 安装依赖**

Run: `pnpm install`
Expected: `dependencies: +XXX` / `devDependencies: +XXX`，node_modules 生成，pnpm-lock.yaml 生成

- [ ] **Step 1.4: 提交**

```bash
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore: init project with dependencies"
```

---

### Task 2: 创建构建与语言配置

**Files:**
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`

- [ ] **Step 2.1: 创建 vite.config.ts**

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

- [ ] **Step 2.2: 创建 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 2.3: 创建 tsconfig.app.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"],
      "#build/ui": ["./node_modules/.nuxt-ui/ui"],
      "#build/ui/*": ["./node_modules/.nuxt-ui/ui/*"]
    },
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "auto-imports.d.ts", "components.d.ts"]
  }
}
```

- [ ] **Step 2.4: 创建 tsconfig.node.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "paths": {
      "#build/ui": ["./node_modules/.nuxt-ui/ui"]
    }
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 2.5: 提交**

```bash
git add vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json
git commit -m "chore: add vite and typescript config"
```

---

### Task 3: 创建代码质量配置

**Files:**
- Create: `eslint.config.js`
- Create: `prettier.config.js`
- Modify: `package.json` (添加 scripts)

- [ ] **Step 3.1: 创建 eslint.config.js**

```js
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
]
```

- [ ] **Step 3.2: 创建 prettier.config.js**

```js
/**
 * @see https://prettier.io/docs/en/configuration.html
 */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
```

- [ ] **Step 3.3: 安装 ESLint 相关依赖**

```bash
pnpm add -D eslint-plugin-vue @vue/eslint-config-typescript @vue/eslint-config-prettier
```

- [ ] **Step 3.4: 提交**

```bash
git add eslint.config.js prettier.config.js package.json pnpm-lock.yaml
git commit -m "chore: add eslint and prettier config"
```

---

### Task 4: 搭建目录结构与入口文件

**Files:**
- Create: `index.html`
- Create: `src/env.d.ts`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/assets/css/main.css`
- Create: `src/data/types/index.ts`
- Create: `src/shared/utils/index.ts`
- Create: `src/stores/index.ts`

- [ ] **Step 4.1: 创建目录结构**

Run:
```bash
mkdir -p src/features/dashboard/pages \
  src/features/data-import/pages \
  src/shared/components \
  src/shared/composables \
  src/shared/utils \
  src/data/api \
  src/data/adapters \
  src/data/types \
  src/layouts \
  src/stores \
  src/assets/css \
  src/router \
  public
```

- [ ] **Step 4.2: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>万象数迹</title>
  </head>
  <body>
    <div id="app" class="isolate"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4.3: 创建 src/env.d.ts**

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
```

- [ ] **Step 4.4: 创建 src/assets/css/main.css**

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

- [ ] **Step 4.5: 创建 src/data/types/index.ts**

```ts
// 基础数据源类型
export interface DataSource {
  id: string
  name: string
  type: 'api' | 'csv' | 'json' | 'manual'
  createdAt: string
  updatedAt: string
}

// 数据记录基础类型
export interface DataRecord {
  id: string
  sourceId: string
  timestamp: string
  [key: string]: unknown
}

// 指标卡片
export interface MetricCard {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  change?: number
}
```

- [ ] **Step 4.6: 创建 src/shared/utils/index.ts**

```ts
export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat('zh-CN').format(n)
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date))
}
```

- [ ] **Step 4.7: 创建 src/stores/index.ts**

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const pageTitle = ref('首页')

  function setPageTitle(title: string) {
    pageTitle.value = title
  }

  return {
    pageTitle,
    setPageTitle,
  }
})
```

- [ ] **Step 4.8: 创建 src/main.ts**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import { routes } from './router'
import './assets/css/main.css'

const app = createApp(App)

const pinia = createPinia()
const router = createRouter({
  routes,
  history: createWebHistory(),
})

app.use(pinia)
app.use(router)
app.use(ui)

app.mount('#app')
```

- [ ] **Step 4.9: 创建 src/App.vue**

```vue
<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
```

- [ ] **Step 4.10: 提交**

```bash
git add index.html src/ public/
git commit -m "feat: scaffold project entry files and directory structure"
```

---

### Task 5: 创建布局组件

**Files:**
- Create: `src/layouts/DefaultLayout.vue`
- Create: `.vscode/settings.json`

- [ ] **Step 5.1: 创建 DefaultLayout.vue**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const colorMode = useColorMode()
const router = useRouter()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(val: boolean) {
    colorMode.value = val ? 'dark' : 'light'
  },
})

const navItems = [
  { label: '首页', icon: 'i-heroicons-home', to: '/' },
  { label: '数据导入', icon: 'i-heroicons-arrow-up-tray', to: '/data-import' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UNavigation
      :items="navItems"
      class="border-b border-(--ui-border)"
    >
      <template #left>
        <span class="text-lg font-bold px-4">万象数迹</span>
      </template>

      <template #right>
        <UTooltip :text="isDark ? '切换亮色模式' : '切换暗色模式'">
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            variant="ghost"
            @click="isDark = !isDark"
          />
        </UTooltip>
      </template>
    </UNavigation>

    <main class="flex-1 p-6">
      <RouterView />
    </main>

    <footer class="py-4 text-center text-sm text-(--ui-text-muted)">
      <span>万象数迹 &copy; {{ new Date().getFullYear() }}</span>
    </footer>
  </div>
</template>
```

- [ ] **Step 5.2: 创建 .vscode/settings.json**

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "tailwindCSS.classAttributes": ["class", "ui"],
  "tailwindCSS.classFunctions": ["defineAppConfig"]
}
```

- [ ] **Step 5.3: 提交**

```bash
git add src/layouts/ .vscode/
git commit -m "feat: add default layout with nav and theme toggle"
```

---

### Task 6: 配置路由与占位页面

**Files:**
- Create: `src/router/index.ts`
- Create: `src/features/dashboard/pages/DashboardPage.vue`
- Create: `src/features/data-import/pages/DataImportPage.vue`

- [ ] **Step 6.1: 创建路由配置**

```ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/features/dashboard/pages/DashboardPage.vue'),
      },
      {
        path: 'data-import',
        name: 'data-import',
        component: () => import('@/features/data-import/pages/DataImportPage.vue'),
      },
    ],
  },
]
```

- [ ] **Step 6.2: 创建首页占位页面**

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
appStore.setPageTitle('首页')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">首页看板</h1>
    <p class="text-(--ui-text-muted)">数据看板正在建设中...</p>
  </div>
</template>
```

- [ ] **Step 6.3: 创建数据导入占位页面**

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
appStore.setPageTitle('数据导入')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">数据导入</h1>
    <p class="text-(--ui-text-muted)">数据导入功能正在建设中...</p>
  </div>
</template>
```

- [ ] **Step 6.4: 提交**

```bash
git add src/router/ src/features/
git commit -m "feat: add vue router config and placeholder pages"
```

---

### Task 7: 验证构建

- [ ] **Step 7.1: 尝试启动 dev server**

Run: `pnpm dev`
Expected: Vite dev server 启动成功，无报错。访问 http://localhost:5173 可看到页面。

- [ ] **Step 7.2: 尝试生产构建**

Run: `pnpm build`
Expected: 构建成功，dist/ 目录生成，无类型错误。

- [ ] **Step 7.3: 提交最终状态**

```bash
git add -A
git commit -m "chore: finalize project scaffolding"
```
