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
