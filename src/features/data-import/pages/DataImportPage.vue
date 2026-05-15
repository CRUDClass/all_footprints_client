<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
appStore.setPageTitle('账单导入')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">数据导入</h1>
    <p class="text-(--ui-text-muted)">数据导入功能正在建设中...</p>
  </div>
</template>
