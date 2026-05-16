---
title: "DefaultLayout Nuxt UI 组件库对齐设计"
date: 2026-05-16
status: approved
---

# DefaultLayout Nuxt UI 组件库对齐设计

## 背景

当前 `DefaultLayout.vue` 使用了 Nuxt UI 的 `USidebar` 组件，但未利用组件的完整能力（如 variant、collapsible modes），结构和 Nuxt UI 官方示例有差距。需要将其对齐到官方推荐模式，同时保留已有功能。

## 目标

- 对齐 Nuxt UI 官方 Sidebar 示例的 props 和模板结构
- 侧边栏折叠模式从 `offcanvas` 改为 `icon`（收缩为图标宽度）
- 通过 props 暴露 variant / collapsible / side 可配置
- 保留面包屑、暗色模式切换、footer

## 组件结构

```
DefaultLayout.vue
├── <USidebar>
│   props: variant="inset", collapsible="icon", side="left", title="万象数迹"
│   ├── header slot → <UIcon name="i-logos-nuxt-icon" />
│   └── <UNavigationMenu>
│       props: items=navItems, orientation="vertical", :collapsed="!sidebarOpen"
│       ui: { link: 'p-1.5 overflow-hidden' }
├── Content wrapper (peer-related CSS)
│   ├── Top bar
│   │   ├── Toggle button (动态 panel-left / panel-right icon)
│   │   ├── UBreadcrumb
│   │   └── Dark mode toggle button (UTooltip + UButton)
│   ├── RouterView
│   └── Footer (版权信息)
```

## Props

```ts
import type { SidebarProps } from '@nuxt/ui'
defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()
```

```ts
import type { SidebarProps } from '@nuxt/ui'

const props = withDefaults(
  defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>(),
  {
    variant: 'inset',
    collapsible: 'icon',
    side: 'left',
  },
)
```

不传 props 时默认 `variant=inset, collapsible=icon, side=left`，与当前行为一致；调用方可通过 router/meta 传入覆盖。

## 关键改动

| 区域 | 改动 |
|------|------|
| 折叠模式 | offcanvas → icon |
| CSS 结构 | 对齐示例，基于 variant/side 动态类名 |
| 侧边栏头部 | hardcoded h2 → title prop + UIcon slot |
| 导航菜单 collapsed | 绑定 sidebarOpen |
| toggle 图标 | i-lucide-menu → i-lucide-panel-left/right |
| 根容器 class | 添加 inset variant 条件 class |

## 保留不变

- navItems 和 breadcrumbItems 逻辑
- 暗色模式 (`useDark` / `useToggle`)
- footer 版权信息
- 路由配置

## 边界情况

- `collapsible="icon"` 模式下，`UNavigationMenu` 的 `collapsed` 需与 sidebar 的 open 状态同步
- 移动端 Sidebar 自动使用 Drawer/Slideover 模式，不受 variant 影响——这与 Nuxt UI 组件自身行为一致，无需额外处理
- Breadcrumb 路由判断保持现有硬编码，不引入通用匹配
