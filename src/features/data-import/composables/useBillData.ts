import { ref, watch } from 'vue'
import { fetchBills } from '@/data/api/bill'
import type { BillRecord } from '@/data/types'

export function useBillData(source: 'WX' | 'ZFB') {
  const bills = ref<BillRecord[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const loading = ref(false)

  async function loadBills() {
    loading.value = true
    try {
      const res = await fetchBills({
        page: page.value,
        pageSize: pageSize.value,
        source,
      })
      if (res.code !== 0) {
        console.error('获取账单数据失败:', res.message)
        return
      }
      bills.value = res.data.records
      total.value = res.data.total
    } catch (e) {
      console.error('获取账单数据失败:', e)
    } finally {
      loading.value = false
    }
  }

  // 翻页时自动重新加载
  watch(page, () => loadBills())

  return { bills, total, page, pageSize, loading, loadBills }
}
