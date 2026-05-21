<script setup lang="ts">
import { computed } from 'vue'
import type { AiBalance } from '@/data/types/ai'

const FIELD_MAP: Partial<Record<keyof AiBalance, string>> = {
  totalBalance: '总额',
  availableBalance: '可用余额',
  grantedBalance: '赠送余额',
  toppedUpBalance: '充值余额',
  voucherBalance: '优惠券余额',
  cashBalance: '现金余额',
  currency: '货币',
}

const props = defineProps<{
  name: string
  balance: AiBalance
}>()

const specificFields = computed(() => {
  const fields: { key: string; label: string; value: string }[] = []
  for (const [key, label] of Object.entries(FIELD_MAP)) {
    if (!label) continue
    const val = props.balance[key as keyof AiBalance]
    if (typeof val === 'string') {
      fields.push({ key, label, value: val })
    }
  }
  return fields
})
</script>

<template>
  <UPageCard :title="name" variant="outline">
    <template #leading>
      <UBadge
        :color="balance.available ? 'success' : 'error'"
        variant="soft"
        size="sm"
      >
        {{ balance.available ? '可用' : '不可用' }}
      </UBadge>
    </template>

    <template #body>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="field in specificFields"
          :key="field.key"
          class="bg-(--ui-bg-elevated)/50 rounded-md p-2.5"
        >
          <div class="text-xs text-(--ui-text-muted) mb-0.5">
            {{ field.label }}
          </div>
          <div class="text-sm font-medium">
            {{ field.key === 'currency' ? field.value : `${field.value} ${balance.currency}` }}
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="text-xs text-(--ui-text-muted)">
        查询时间：{{ balance.queryTime || '--' }}
      </div>
    </template>
  </UPageCard>
</template>
