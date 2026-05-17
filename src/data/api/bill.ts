import type { ApiResponse, BillQueryParams, BillRecord, IncomeExpenseType, PaginatedResponse, WeeklyStatDTO } from '@/data/types'

/** 上传账单文件（CSV/XLSX），根据 source 路由到微信或支付宝接口 */
export async function uploadBill(file: File, source: 'WX' | 'ZFB'): Promise<ApiResponse<null>> {
  const endpoint = source === 'WX' ? '/bill/wechat' : '/bill/alipay'
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(endpoint, { method: 'POST', body: formData })
  if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)
  return response.json()
}

/** 分页查询账单列表，按 source 区分微信/支付宝数据源 */
export async function fetchBills(
  params: BillQueryParams,
): Promise<ApiResponse<PaginatedResponse<BillRecord>>> {
  const sourcePath = params.source === 'WX' ? 'wechat' : 'alipay'
  const query = new URLSearchParams({
    current: String(params.page),
    size: String(params.pageSize),
  })

  const response = await fetch(`/bill/${sourcePath}-bill-list?${query}`)
  if (!response.ok) throw new Error(`Fetch bills failed: ${response.statusText}`)
  return response.json()
}

/** 按周维度统计微信/支付宝交易金额（当年），区分支出/收入 */
export async function fetchWeeklyStats(
  source: 'WX' | 'ZFB',
  incomeExpense: IncomeExpenseType,
): Promise<ApiResponse<WeeklyStatDTO[]>> {
  const sourcePath = source === 'WX' ? 'wechat' : 'alipay'
  const query = new URLSearchParams({ incomeExpense })

  const response = await fetch(`/bill/stats/weekly/${sourcePath}?${query}`)
  if (!response.ok) throw new Error(`Fetch weekly stats failed: ${response.statusText}`)
  return response.json()
}
