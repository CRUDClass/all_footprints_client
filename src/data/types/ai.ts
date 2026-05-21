/** 单个 AI 的余额信息 */
export interface AiBalance {
  available: boolean
  totalBalance: string
  availableBalance: string
  currency: string
  queryTime: string
  // DeepSeek 特有
  grantedBalance?: string
  toppedUpBalance?: string
  // Kimi 特有
  voucherBalance?: string
  cashBalance?: string
}

/** /api/balance/latest 返回的 data 结构 */
export interface BalanceData {
  DEEPSEEK: AiBalance
  KIMI: AiBalance
}
