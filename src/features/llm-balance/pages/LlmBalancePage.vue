<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useAiBalance } from '@/features/llm-balance/composables/useAiBalance'
import AiBalanceCard from '@/features/llm-balance/components/AiBalanceCard.vue'

const appStore = useAppStore()
appStore.setPageTitle('LLM 余额')

const { data, loading, error, load } = useAiBalance()

function fetchData() {
  load() // useAiBalance catches errors internally into error ref
}

onMounted(fetchData)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">LLM 余额</h1>

    <!-- 加载中：两个 USkeleton 占位 -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <USkeleton class="h-[260px] rounded-lg" />
      <USkeleton class="h-[260px] rounded-lg" />
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-16 gap-4"
    >
      <p class="text-(--ui-text-muted)">{{ error }}</p>
      <UButton color="primary" variant="soft" @click="fetchData">
        重新加载
      </UButton>
    </div>

    <!-- 成功状态 -->
    <UPageGrid v-else-if="data">
      <AiBalanceCard
        v-if="data.DEEPSEEK"
        name="DeepSeek"
        :balance="data.DEEPSEEK"
      />
      <AiBalanceCard
        v-if="data.KIMI"
        name="Kimi"
        :balance="data.KIMI"
      />
    </UPageGrid>
  </div>
</template>
