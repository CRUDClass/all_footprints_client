import { ref } from 'vue'
import { fetchBalance } from '@/data/api/ai'
import type { BalanceData } from '@/data/types/ai'
import { useLoading } from '@/shared/composables/useLoading'

export function useAiBalance() {
  const data = ref<BalanceData | null>(null)
  const error = ref<string | null>(null)

  const { loading, execute: load } = useLoading(async () => {
    error.value = null
    try {
      const res = await fetchBalance()
      if (res.code !== 200) {
        error.value = res.msg || '获取余额失败'
        data.value = null
        return
      }
      data.value = res.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取余额失败'
      data.value = null
    }
  }, { minDuration: 1000 })

  return { data, loading, error, load }
}
