# DefaultLayout Nuxt UI Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align DefaultLayout.vue with Nuxt UI official Sidebar example pattern

**Architecture:** Single-file change — modify `src/layouts/DefaultLayout.vue` to add props for variant/collapsible/side, switch collapse mode from offcanvas to icon, update CSS classes to match Nuxt UI example structure.

**Tech Stack:** Vue 3, Nuxt UI (USidebar, UNavigationMenu), @vueuse/core

---

### Task 1: Update DefaultLayout.vue

**Files:**
- Modify: `src/layouts/DefaultLayout.vue`

- [ ] **Step 1: Update script setup — add types and props**

Change the script block to add Nuxt UI type imports and reactive props with defaults.

```ts
<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

const props = withDefaults(
  defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>(),
  {
    variant: 'inset',
    collapsible: 'icon',
    side: 'left',
  },
)

// 暗色/亮色模式切换
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 侧边栏展开/收起状态
const sidebarOpen = ref(false)

// 左侧导航菜单项配置
const navItems: NavigationMenuItem[] = [
  { label: '首页', icon: 'i-lucide-home', to: '/' },
  {
    label: '账单',
    icon: 'i-lucide-upload',
    defaultOpen: true,
    children: [
      { label: '微信', to: '/bill/wechat' },
      { label: '支付宝', to: '/bill/alipay' },
    ],
  },
]

const route = useRoute()

// 面包屑：根据当前路由动态生成
const breadcrumbItems = computed(() => {
  if (route.path === '/') return [{ label: '首页', to: '/' }]
  if (route.path === '/bill/wechat') {
    return [
      { label: '首页', to: '/' },
      { label: '微信', to: '/bill/wechat' },
    ]
  }
  if (route.path === '/bill/alipay') {
    return [
      { label: '首页', to: '/' },
      { label: '支付宝', to: '/bill/alipay' },
    ]
  }
  return [{ label: '首页', to: '/' }]
})
</script>
```

- [ ] **Step 2: Replace template — restructure USidebar and content area**

Replace the entire `<template>` block:

```vue
<template>
  <div
    class="flex flex-1"
    :class="[
      variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
      side === 'right' && 'flex-row-reverse',
    ]"
  >
    <USidebar
      v-model:open="sidebarOpen"
      :variant="variant"
      :collapsible="collapsible"
      :side="side"
      title="万象数迹"
      :ui="{
        container: 'h-full',
      }"
    >
      <template #header>
        <UIcon name="i-logos-nuxt-icon" class="size-8" />
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        :collapsed="!sidebarOpen"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <!-- Top bar: toggle + breadcrumb + dark mode -->
      <div
        class="h-(--ui-header-height) shrink-0 flex items-center gap-4 px-4"
        :class="[
          variant !== 'floating' && 'border-b border-default',
          side === 'right' && 'justify-end',
        ]"
      >
        <UButton
          :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="sidebarOpen = !sidebarOpen"
        />

        <div class="flex-1 flex justify-center">
          <UBreadcrumb :items="breadcrumbItems" />
        </div>

        <UTooltip :text="isDark ? '切换亮色模式' : '切换暗色模式'">
          <UButton
            :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
            color="neutral"
            variant="ghost"
            @click="toggleDark()"
          />
        </UTooltip>
      </div>

      <!-- Main content + footer -->
      <div class="flex-1 flex flex-col overflow-y-auto">
        <main class="flex-1 p-6">
          <RouterView />
        </main>

        <footer class="py-4 text-center text-sm text-(--ui-text-muted)">
          <span>万象数迹 &copy; {{ new Date().getFullYear() }}</span>
        </footer>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify the change builds and renders**

```bash
pnpm dev
# Visit http://localhost:5173
# Expected: Sidebar collapses to icon-width (not fully hidden), 
# toggle icon shows panel-left, title "万象数迹" in sidebar header
```

- [ ] **Step 4: Type-check**

```bash
pnpm typecheck
# Expected: No type errors
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/DefaultLayout.vue
git commit -m "refactor: align DefaultLayout with Nuxt UI Sidebar example pattern

- Add variant/collapsible/side props with defaults (inset/icon/left)
- Switch collapse mode from offcanvas to icon
- Align CSS structure with Nuxt UI official example
- Replace hardcoded h2 header with title prop + UIcon slot
- Bind UNavigationMenu collapsed state to sidebarOpen
- Use dynamic toggle icon based on sidebar side
- Add variant-conditional border and background classes
"
```
