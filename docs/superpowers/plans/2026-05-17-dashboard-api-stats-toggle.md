# Dashboard API Stats + Income/Expense Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded weekly spending data on the dashboard with API calls, and add a USwitch to toggle between expense (支出) and income (收入) views.

**Architecture:** 3-file change: types → API function → page component. The dashboard fetches weekly stats for both WeChat and Alipay in parallel, maps `weekNumber` → 52-element array, and feeds Chart.js. A USwitch toggles between `EXPENSE` and `INCOME` query parameters.

**Tech Stack:** Vue 3 + TypeScript + Nuxt UI (USwitch) + Chart.js + fetch API

---

### Task 1: Add WeeklyStatDTO and IncomeExpenseType to types

**Files:**
- Modify: `src/data/types/index.ts` — append at end of file

- [ ] **Step 1: Add type definitions after existing `ApiResponse<T>` interface**

```typescript
/** 收入/支出类型：用于账单统计查询 */
export type IncomeExpenseType = 'EXPENSE' | 'INCOME'

/** 每周统计数据：来自 /bill/stats/weekly/* 接口 */
export interface WeeklyStatDTO {
  weekNumber: number
  totalAmount: number
}
```

- [ ] **Step 2: Verify no type errors**

Run: `pnpm typecheck`
Expected: passes with no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/types/index.ts
git commit -m "feat: add IncomeExpenseType and WeeklyStatDTO types"
```

---

### Task 2: Add fetchWeeklyStats API function

**Files:**
- Modify: `src/data/api/bill.ts` — add new function

- [ ] **Step 1: Add import for new types and the fetch function**

Import `IncomeExpenseType` and `WeeklyStatDTO` (will be auto-imported from `@/data/types`). Add function before the last `}` of the file:

```typescript
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
```

- [ ] **Step 2: Verify type checking passes**

Run: `pnpm typecheck`
Expected: passes with no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/api/bill.ts
git commit -m "feat: add fetchWeeklyStats API function"
```

---

### Task 3: Rewrite DashboardPage.vue — API integration + USwitch toggle

**Files:**
- Modify: `src/features/dashboard/pages/DashboardPage.vue` — complete rewrite

- [ ] **Step 1: Rewrite `<script setup>` to replace hardcoded data with API calls**

The new script block replaces all hardcoded arrays with reactive state, API calls, and USwitch binding:

```vue
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import { fetchWeeklyStats } from '@/data/api/bill'
import type { IncomeExpenseType, WeeklyStatDTO } from '@/data/types'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const appStore = useAppStore()
appStore.setPageTitle('首页')

// 收入/支出模式切换 (USwitch v-model: false=支出, true=收入)
const isIncome = ref(false)
const loading = ref(false)
const wechatStats = ref<WeeklyStatDTO[]>([])
const alipayStats = ref<WeeklyStatDTO[]>([])

const incomeExpense = computed<IncomeExpenseType>(() =>
  isIncome.value ? 'INCOME' : 'EXPENSE',
)

// 将 API 返回的 WeeklyStatDTO[] 按 weekNumber 映射到 52 周数组
function mapToWeeklyArray(stats: WeeklyStatDTO[]): number[] {
  const arr = Array(52).fill(0)
  for (const s of stats) {
    if (s.weekNumber >= 1 && s.weekNumber <= 52) {
      arr[s.weekNumber - 1] = s.totalAmount
    }
  }
  return arr
}

// 并行请求微信和支付宝周统计数据
async function loadStats() {
  loading.value = true
  try {
    const [wxResult, zfbResult] = await Promise.all([
      fetchWeeklyStats('WX', incomeExpense.value),
      fetchWeeklyStats('ZFB', incomeExpense.value),
    ])
    wechatStats.value = wxResult.data ?? []
    alipayStats.value = zfbResult.data ?? []
  } catch (err) {
    console.error('加载周统计数据失败:', err)
    // 保留上一次成功数据
  } finally {
    loading.value = false
  }
}

const labels = Array.from({ length: 52 }, (_, i) => `第${i + 1}周`)

const chartTypeLabel = computed(() => (isIncome.value ? '收入' : '支出'))

const chartData = computed<ChartData<'line'>>(() => ({
  labels,
  datasets: [
    {
      label: '支付宝',
      data: mapToWeeklyArray(alipayStats.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      tension: 0.3,
    },
    {
      label: '微信',
      data: mapToWeeklyArray(wechatStats.value),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      tension: 0.3,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  plugins: {
    title: {
      display: true,
      text: `全年每周${chartTypeLabel.value}趋势`,
      font: { size: 16, weight: 500 },
      padding: { bottom: 20 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.dataset.label}: ${ctx.parsed.y ?? 0}元`,
      },
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: `${chartTypeLabel.value}金额（元）`,
      },
    },
    x: {
      ticks: {
        maxTicksLimit: 13,
      },
    },
  },
}))

onMounted(loadStats)
watch(isIncome, loadStats)
</script>
```

- [ ] **Step 2: Rewrite `<template>` to include USwitch above the chart**

```vue
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">首页看板</h1>
      <USwitch
        v-model="isIncome"
        :loading="loading"
        :label="`${chartTypeLabel}统计`"
        unchecked-icon="i-lucide-trending-down"
        checked-icon="i-lucide-trending-up"
        color="primary"
      />
    </div>
    <div class="rounded-xl border border-default p-4 bg-default">
      <ChartView
        type="line"
        :data="chartData"
        :options="chartOptions"
        height="400px"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify locally**

Run dev server and check:
```bash
pnpm dev
```
- Page loads without errors
- Chart shows API data (or empty state if no data)
- Toggle switch switches between 支出/收入
- Loading state visible during API requests

- [ ] **Step 4: Type check**

Run: `pnpm typecheck`
Expected: passes with no errors

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/pages/DashboardPage.vue
git commit -m "feat: replace hardcoded dashboard data with API + add income/expense toggle"
```

---

### Verification

After all tasks complete, run the full check suite:

```bash
pnpm typecheck && git status
```
