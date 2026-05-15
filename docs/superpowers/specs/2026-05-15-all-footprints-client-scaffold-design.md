# 万象数迹 — 项目初始化设计

## 概述

"万象数迹"（all_footprints_client）是一个综合型个人数据管理系统，前端负责数据展示与导入。本文档仅覆盖项目初始化阶段：技术栈搭建、目录结构、基础布局和路由框架。页面功能内容后续迭代。

## 技术栈

| 类别 | 技术 | 版本 |
|---|---|---|
| 框架 | Vue 3 + Vite | latest |
| UI 组件库 | @nuxt/ui | 4.7.1 |
| 样式 | Tailwind CSS | v4 |
| 路由 | vue-router | 4.x |
| 状态管理 | pinia | latest |
| 语言 | TypeScript | latest |
| 包管理 | pnpm | 10 (当前环境) |
| 图表 | (预留，后续按需引入) | - |

## 目录结构

```
all_footprints_client/
├── src/
│   ├── features/
│   │   ├── dashboard/          # 首页看板（后续实现）
│   │   │   └── pages/
│   │   │       └── DashboardPage.vue
│   │   └── data-import/        # 数据导入（后续实现）
│   │       └── pages/
│   │           └── DataImportPage.vue
│   ├── shared/
│   │   ├── components/
│   │   ├── composables/
│   │   └── utils/
│   ├── data/
│   │   ├── api/
│   │   ├── adapters/
│   │   └── types/
│   |       └── index.ts
│   ├── layouts/
│   │   └── DefaultLayout.vue
│   ├── stores/
│   │   └── index.ts
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── eslint.config.js
├── prettier.config.js
└── .gitignore
```

## 布局

顶部导航栏 + 主内容区，无侧边栏。

```
┌─────────────────────────────────────┐
│  万象数迹  首页 | 数据导入  [主题切换] │
├─────────────────────────────────────┤
│          <RouterView />             │
│                                     │
├─────────────────────────────────────┤
│          底部页脚 (简单版权)          │
└─────────────────────────────────────┘
```

## 路由

```
/              → DashboardPage（首页看板）
/data-import   → DataImportPage（数据导入）
```

## Nuxt UI 配置

- 使用 `@nuxt/ui/vite` 插件集成
- 使用 `@nuxt/ui/vue-plugin` 在 `main.ts` 中安装
- 主色调：blue（默认）
- 启用 color mode 主题切换
- `App.vue` 包裹 `<UApp>`
- `index.html` 根容器添加 `isolate` class

## 初始阶段范围限定

本次实现仅包含：
1. 项目初始化（package.json、vite 配置、tsconfig 等）
2. 依赖安装
3. 目录结构搭建（含空页面占位）
4. 基础布局组件（顶部导航 + 内容区 + 页脚）
5. 路由配置（两条路由指向占位页面）
6. Pinia store 基础框架
7. 类型声明与基础类型定义
8. ESLint + Prettier 配置

页面内容、图表、数据接入、导入功能均不在本次范围内。
