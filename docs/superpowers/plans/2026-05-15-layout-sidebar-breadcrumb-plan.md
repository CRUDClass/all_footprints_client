# Layout Redesign: USidebar + UBreadcrumb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace top UNavigation with collapsible USidebar (offcanvas, default closed) + centered UBreadcrumb.

**Architecture:** Single-file layout change. DefaultLayout.vue transforms from a vertical top-nav layout to a horizontal sidebar + content split. The USidebar wraps the left side, the right side contains a top bar (toggle + breadcrumb) + main content + existing footer.

**Tech Stack:** Vue 3 + Nuxt UI 4 (USidebar, UBreadcrumb, UNavigationMenu, UButton) + Tailwind CSS v4 + @vueuse/core (useDark/useToggle)

---

### Task 1: Rewrite DefaultLayout.vue

**Files:**
- Modify: `src/layouts/DefaultLayout.vue` (entire file)

- [ ] **Step 1: Replace UNavigation with USidebar layout**

Replace the entire file content with:

```vue
<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const navItems = [
  { label: '首页', icon: 'i-heroicons-home', to: '/' },
  { label: '账单导入', icon: 'i-heroicons-arrow-up-tray', to: '/data-import' },
]

const route = useRoute()

const breadcrumbItems = computed(() => {
  if (route.path === '/') return [{ label: '首页', to: '/' }]
  if (route.path === '/data-import') {
    return [
      { label: '首页', to: '/' },
      { label: '账单导入', to: '/data-import' },
    ]
  }
  return [{ label: '首页', to: '/' }]
})
</script>

<template>
  <div class="flex min-h-screen">
    <USidebar v-model:open="sidebarOpen" collapsible="offcanvas">
      <template #header>
        <h2 class="text-lg font-bold px-3 py-4">万象数迹</h2>
      </template>

      <UNavigationMenu :items="navItems" />
    </USidebar>

    <div class="flex flex-col flex-1 min-w-0">
      <!-- Top bar: toggle + breadcrumb -->
      <div class="flex items-center h-14 px-4 border-b border-(--ui-border)">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          @click="toggleSidebar()"
        />
        <div class="flex-1 flex justify-center">
          <UBreadcrumb :items="breadcrumbItems" />
        </div>
        <!-- Spacer to keep center alignment with toggle on left -->
        <div class="w-10" />
      </div>

      <!-- Main content -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>

      <!-- Footer -->
      <footer class="py-4 text-center text-sm text-(--ui-text-muted)">
        <span>万象数迹 &copy; {{ new Date().getFullYear() }}</span>
      </footer>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify the build**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 3: Start dev server to verify visually**

Run: `pnpm dev`
Expected: Layout shows sidebar hidden by default, toggle button top-left, breadcrumb centered. Click toggle → sidebar slides in. Dark mode toggle should still work (if applicable — verify no regression).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/DefaultLayout.vue
git commit -m "feat: replace UNavigation with USidebar + UBreadcrumb layout"
```

---

### Task 2: Update DataImportPage.vue title (consistency)

**Files:**
- Modify: `src/features/data-import/pages/DataImportPage.vue`

- [ ] **Step 1: Update page title**

Change `appStore.setPageTitle('数据导入')` to `appStore.setPageTitle('账单导入')`.

- [ ] **Step 2: Commit**

```bash
git add src/features/data-import/pages/DataImportPage.vue
git commit -m "refactor: update data import page title to 账单导入"
```

---

### Self-Review Checklist

1. **Spec coverage:**
   - Removed UNavigation ✅
   - Added USidebar with offcanvas, default closed, toggle ✅
   - Breadcrumb centered in top bar alongside toggle ✅
   - Navigation items: 首页, 账单导入 ✅
   - Footer stays unchanged ✅
   - All constraints followed (useDark from @vueuse, U-prefix components) ✅

2. **Placeholder scan:** No TBD, TODO, or incomplete code.

3. **Type consistency:** Single-file change, no cross-task type issues.
