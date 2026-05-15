<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
appStore.setPageTitle('支付宝账单')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">支付宝账单</h1>
    <p class="text-(--ui-text-muted)">支付宝账单导入功能正在建设中...</p>
  </div>
</template>
