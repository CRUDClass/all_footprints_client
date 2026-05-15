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
