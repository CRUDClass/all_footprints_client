import type { ApiResponse } from '@/data/types'
import type { BalanceData } from '@/data/types/ai'

/** 获取所有 AI 账户的余额快照 */
export async function fetchBalance(): Promise<ApiResponse<BalanceData>> {
  const response = await fetch('/api/balance/latest')
  if (!response.ok) throw new Error(`Fetch balance failed: ${response.statusText}`)
  return response.json()
}
