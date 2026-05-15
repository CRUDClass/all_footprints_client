// 基础数据源类型
export interface DataSource {
  id: string
  name: string
  type: 'api' | 'csv' | 'json' | 'manual'
  createdAt: string
  updatedAt: string
}

// 数据记录基础类型
export interface DataRecord {
  id: string
  sourceId: string
  timestamp: string
  [key: string]: unknown
}

// 指标卡片
export interface MetricCard {
  title: string
  value: number | string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  change?: number
}
