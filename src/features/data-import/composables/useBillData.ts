import { fetchBills } from '@/data/api/bill'
import type { BillRecord } from '@/data/types'
import { ref, watch } from 'vue'

/**
 * 账单数据管理：加载、分页、响应式状态
 * @param source - 数据来源 'WX' | 'ZFB'
 * @returns bills 账单列表 / total 总数 / page 当前页 / pageSize 每页条数 / loading 加载状态 / loadBills 加载函数
 */
export function useBillData(source: 'WX' | 'ZFB') {
  const bills = ref<BillRecord[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)

  /** 调用 API 加载账单，page 变化时自动触发 */
  async function loadBills() {
    loading.value = true
    try {
      const res = await fetchBills({
        page: page.value,
        pageSize: pageSize.value,
        source,
      })
      if (res.code !== 200) {
        console.error('获取账单数据失败:', res.msg)
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

  // 翻页时自动重新加载数据
  watch(page, () => loadBills())

  return { bills, total, page, pageSize, loading, loadBills }
}
