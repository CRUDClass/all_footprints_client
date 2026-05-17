---
title: 首页看板统计——API 数据源 + 收入/支出切换
date: 2026-05-17
status: approved
---

# 首页看板统计——API 数据源 + 收入/支出切换

## 概述

将首页看板的全年每周趋势图从硬编码 Mock 数据改为从后端 API 实时获取，并增加收入/支出模式切换功能。

## 交互设计

使用 Nuxt UI `USwitch` 组件，置于图表上方：

- **默认状态（unchecked）**：支出模式，label="支出统计"，icon=`i-lucide-trending-down`，API 参数 `incomeExpense=EXPENSE`
- **切换状态（checked）**：收入模式，label="收入统计"，icon=`i-lucide-trending-up`，API 参数 `incomeExpense=INCOME`
- 切换时图表重新请求对应类型的数据，并显示 loading 状态
- 图表标题动态变化："全年每周支出趋势" / "全年每周收入趋势"

## API 接口

后端已有端点：

- `GET /bill/stats/weekly/wechat?incomeExpense=EXPENSE`
- `GET /bill/stats/weekly/alipay?incomeExpense=EXPENSE`
- `GET /bill/stats/weekly/wechat?incomeExpense=INCOME`
- `GET /bill/stats/weekly/alipay?incomeExpense=INCOME`

响应格式：

```ts
interface RListWeeklyStatDTO {
  code: number    // 0 表示成功
  msg: string
  data: WeeklyStatDTO[]
}

interface WeeklyStatDTO {
  weekNumber: number  // ISO 周编号 (1-53)
  totalAmount: number // 该周总金额
}
```

## 改动清单

### 1. `src/data/types/index.ts`

新增类型：

```ts
export type IncomeExpenseType = 'EXPENSE' | 'INCOME'

export interface WeeklyStatDTO {
  weekNumber: number
  totalAmount: number
}
```

### 2. `src/data/api/bill.ts`

新增 `fetchWeeklyStats()` 函数，支持收入/支出参数：

```ts
export async function fetchWeeklyStats(
  source: 'WX' | 'ZFB',
  incomeExpense: IncomeExpenseType,
): Promise<ApiResponse<WeeklyStatDTO[]>>
```

复用现有 `fetch` 模式和错误处理风格。

### 3. `src/features/dashboard/pages/DashboardPage.vue`

- 删除 `alipayData`、`wechatData` 硬编码数组
- 新增 `ref`：
  - `isIncome` (boolean, 默认 `false`) — 绑定 `USwitch v-model`
  - `alipayStats` / `wechatStats` — API 返回的周统计数据
  - `loading` — 请求中状态
- 新增 `incomeExpense` 计算属性，根据 `isIncome` 返回 `'EXPENSE'` 或 `'INCOME'`
- `onMounted` + `watch(isIncome)` 触发 `loadStats()` 函数
- `loadStats()`：并行请求 `/weekly/wechat` 和 `/weekly/alipay`，将返回的 `WeeklyStatDTO[]` 按 `weekNumber` 映射到 52 周的 `totalAmount` 数组（无数据的周填 0），赋值给 `chartData`
- 保留 `ChartView` 组件，图表配置不变，仅更新数据源和标题
- 添加 USwitch 到 template，置于图表标题区域

## 数据映射逻辑

API 返回的 `WeeklyStatDTO[]` 并不保证覆盖全年 52 周（例如只返回了有交易记录的周）。需要将 `weekNumber → totalAmount` 映射到固定长度 52 的数组，缺失周填 0：

```ts
function mapToWeeklyArray(stats: WeeklyStatDTO[]): number[] {
  const arr = Array(52).fill(0)
  for (const s of stats) {
    if (s.weekNumber >= 1 && s.weekNumber <= 52) {
      arr[s.weekNumber - 1] = s.totalAmount
    }
  }
  return arr
}
```

## 状态处理

| 状态 | 表现 |
|------|------|
| Loading | 图表区域显示 loading 指示器（USwitch 本身也支持 loading prop） |
| Error | toast 或控制台提示，图表保留上一次成功数据 |
| Empty | 正常渲染图表，所有数据点为 0（即全年无交易） |
| 切换模式 | 重新请求，loading 闪烁 |

## 测试策略

- 手动验证：切换开关，图表数据应正确切换为支出/收入
- 验证 API 返回空数据时图表能正常渲染
- 验证 loading 状态在请求期间正确显示
