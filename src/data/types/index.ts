/** 基础数据源类型 */
export interface DataSource {
  id: string
  name: string
  type: 'api' | 'csv' | 'json' | 'manual'
  createdAt: string
  updatedAt: string
}

/** 数据记录基础类型 */
export interface DataRecord {
  id: string
  sourceId: string
  timestamp: string
  [key: string]: unknown
}

/** 首页看板指标卡片 */
export interface MetricCard {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  change?: number
}

/** 账单交易记录：支持微信(WX)和支付宝(ZFB)两种来源 */
export interface BillRecord {
  id: number
  source: 'WX' | 'ZFB'
  tradeTime: string
  incomeExpense: 'INCOME' | 'EXPENSE'
  amount: number
  remark: string
  tradeNo: string
  // 微信特有字段
  counterparty?: string
  product?: string
  wxType?: string
  paymentMethod?: string
  status?: string
  merchantNo?: string
  // 支付宝特有字段
  category?: string
  zfbAccount?: string
  alipaySource?: string
  alipayTags?: string
  createTime?: string
  createUser?: number
  deleted?: number
}

/** 账单列表分页查询参数 */
export interface BillQueryParams {
  page: number
  pageSize: number
  source: 'WX' | 'ZFB'
}

/** 泛型分页响应结构 */
export interface PaginatedResponse<T> {
  records: T[]
  total: number
  current: number
  size: number
}

/** 后端 API 统一响应格式：code=0 表示成功 */
export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}
