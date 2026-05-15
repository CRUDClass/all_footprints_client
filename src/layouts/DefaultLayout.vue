<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

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
            @click="toggleDark()"
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
