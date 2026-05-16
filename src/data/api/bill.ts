import type { ApiResponse, BillQueryParams, BillRecord, PaginatedResponse } from '@/data/types'

export async function uploadBill(file: File, source: 'WX' | 'ZFB'): Promise<ApiResponse<null>> {
  const endpoint = source === 'WX' ? '/bill/wechat' : '/bill/alipay'
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(endpoint, { method: 'POST', body: formData })
  if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)
  return response.json()
}

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
