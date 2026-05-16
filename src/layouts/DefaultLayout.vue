<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 暗色/亮色模式切换
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 侧边栏展开/收起状态
const sidebarOpen = ref(false)

// 左侧导航菜单项配置
const navItems = [
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

<template>
  <div class="flex flex-1 min-h-screen">
    <USidebar
      v-model:open="sidebarOpen"
      collapsible="offcanvas"
      :ui="{
        container: 'h-full'
      }"
    >
      <template #header>
        <h2 class="text-lg font-bold px-3 py-4">万象数迹</h2>
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <!-- Top bar: toggle + breadcrumb + dark mode -->
      <div
        class="h-(--ui-header-height) shrink-0 flex items-center gap-4 px-4 border-b border-default"
      >
        <UButton
          icon="i-lucide-menu"
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
