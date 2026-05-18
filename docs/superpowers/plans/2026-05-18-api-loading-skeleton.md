# API Loading + Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable `useLoading` composable (min 1s loading guarantee) and integrate Skeleton placeholder into the dashboard.

**Architecture:** A composable wrapping async functions with `Promise.all([fn, delay(1000)])` to enforce minimum loading duration. Replace manual `loading = ref(true/false)` in existing composables. Add `<USkeleton>` to DashboardPage for chart loading state.

**Tech Stack:** Vue 3 composables, Nuxt UI USkeleton, TypeScript

---

## File Structure

| Action | File | Responsibility |
|---|---|---|
| **Create** | `src/shared/composables/useLoading.ts` | Core composable: min-duration loading wrapper |
| **Modify** | `src/features/data-import/composables/useBillData.ts` | Replace manual loading with useLoading |
| **Modify** | `src/features/data-import/composables/useFileUpload.ts` | Replace manual uploading with useLoading |
| **Modify** | `src/features/dashboard/pages/DashboardPage.vue` | Add useLoading + Skeleton to chart |

---

### Task 1: Create `useLoading` composable

**Files:**
- Create: `src/shared/composables/useLoading.ts`

- [ ] **Step 1: Write the composable**

```ts
import { ref } from 'vue'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { minDuration?: number },
) {
  const loading = ref(false)
  let pendingCount = 0

  async function execute(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    pendingCount++
    loading.value = true
    try {
      const [result] = await Promise.all([
        fn(...args),
        delay(options?.minDuration ?? 1000),
      ])
      return result
    } finally {
      pendingCount--
      if (pendingCount === 0) loading.value = false
    }
  }

  return { loading, execute }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors (this file has no imports beyond `vue`).

- [ ] **Step 3: Commit**

```bash
git add src/shared/composables/useLoading.ts
git commit -m "feat: add useLoading composable with min 1s loading guarantee"
```

---

### Task 2: Refactor `useBillData` to use `useLoading`

**Files:**
- Modify: `src/features/data-import/composables/useBillData.ts`

- [ ] **Step 1: Replace manual loading with `useLoading`**

Old:
```ts
import { fetchBills } from '@/data/api/bill'
import type { BillRecord } from '@/data/types'
import { ref, watch } from 'vue'

export function useBillData(source: 'WX' | 'ZFB') {
  const bills = ref<BillRecord[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)

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

  watch(page, () => loadBills())

  return { bills, total, page, pageSize, loading, loadBills }
}
```

New:
```ts
import { fetchBills } from '@/data/api/bill'
import type { BillRecord } from '@/data/types'
import { useLoading } from '@/shared/composables/useLoading'
import { ref, watch } from 'vue'

export function useBillData(source: 'WX' | 'ZFB') {
  const bills = ref<BillRecord[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  const { loading, execute: loadBills } = useLoading(
    async () => {
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
    },
    { minDuration: 1000 },
  )

  watch(page, () => loadBills())

  return { bills, total, page, pageSize, loading, loadBills }
}
```

- [ ] **Step 2: TypeScript check**

Run: `pnpm typecheck`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/data-import/composables/useBillData.ts
git commit -m "refactor: use useLoading in useBillData for min 1s loading"
```

---

### Task 3: Refactor `useFileUpload` to use `useLoading`

**Files:**
- Modify: `src/features/data-import/composables/useFileUpload.ts`

- [ ] **Step 1: Replace manual uploading with `useLoading`**

Old:
```ts
import { ref } from 'vue'
import { uploadBill } from '@/data/api/bill'

export function useFileUpload(source: 'WX' | 'ZFB', onSuccess: () => void) {
  const uploading = ref(false)
  const fileInput = ref<HTMLInputElement | undefined>()

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploading.value = true
    try {
      await uploadBill(file, source)
      onSuccess()
    } catch (e) {
      console.error('文件上传失败:', e)
    } finally {
      uploading.value = false
      target.value = ''
    }
  }

  function triggerFilePicker() {
    fileInput.value?.click()
  }

  return { uploading, fileInput, handleFileChange, triggerFilePicker }
}
```

New:
```ts
import { ref } from 'vue'
import { uploadBill } from '@/data/api/bill'
import { useLoading } from '@/shared/composables/useLoading'

export function useFileUpload(source: 'WX' | 'ZFB', onSuccess: () => void) {
  const fileInput = ref<HTMLInputElement | undefined>()

  const { loading: uploading, execute: doUpload } = useLoading(
    async (file: File) => {
      await uploadBill(file, source)
      onSuccess()
    },
    { minDuration: 1000 },
  )

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
      await doUpload(file)
    } catch (e) {
      console.error('文件上传失败:', e)
    } finally {
      target.value = ''
    }
  }

  function triggerFilePicker() {
    fileInput.value?.click()
  }

  return { uploading, fileInput, handleFileChange, triggerFilePicker }
}
```

- [ ] **Step 2: TypeScript check**

Run: `pnpm typecheck`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/data-import/composables/useFileUpload.ts
git commit -m "refactor: use useLoading in useFileUpload for min 1s loading"
```

---

### Task 4: DashboardPage — add `useLoading` + Skeleton

**Files:**
- Modify: `src/features/dashboard/pages/DashboardPage.vue`

- [ ] **Step 1: Add useLoading import and Skeleton template**

Old script:
```ts
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import { fetchWeeklyStats } from '@/data/api/bill'
import type { IncomeExpenseType, WeeklyStatDTO } from '@/data/types'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const appStore = useAppStore()
appStore.setPageTitle('首页')

const isIncome = ref(false)
const loading = ref(false)
const wechatStats = ref<WeeklyStatDTO[]>([])
const alipayStats = ref<WeeklyStatDTO[]>([])

const incomeExpense = computed<IncomeExpenseType>(() =>
  isIncome.value ? 'INCOME' : 'EXPENSE',
)

// ... (mapToWeeklyArray, loadId, loadStats, chartOptions, template unchanged except below)

onMounted(loadStats)
watch(isIncome, loadStats)
```

Old template:
```html
<div class="rounded-xl border border-default p-4 bg-default">
  <ChartView
    type="line"
    :data="chartData"
    :options="chartOptions"
    height="400px"
  />
</div>
```

New script:
```ts
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import { fetchWeeklyStats } from '@/data/api/bill'
import { useLoading } from '@/shared/composables/useLoading'
import type { IncomeExpenseType, WeeklyStatDTO } from '@/data/types'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const appStore = useAppStore()
appStore.setPageTitle('首页')

const isIncome = ref(false)
const wechatStats = ref<WeeklyStatDTO[]>([])
const alipayStats = ref<WeeklyStatDTO[]>([])

const incomeExpense = computed<IncomeExpenseType>(() =>
  isIncome.value ? 'INCOME' : 'EXPENSE',
)

// ... (mapToWeeklyArray unchanged)

let loadId = 0

// useLoading 自动管理 loading（min 1s）+ pendingCount 防折叠
// loadId 在内部闭包中做数据过期丢弃，防止快速切换时数据错乱
const { loading, execute: loadStats } = useLoading(
  async () => {
    const id = ++loadId
    const [wxResult, zfbResult] = await Promise.all([
      fetchWeeklyStats('WX', incomeExpense.value),
      fetchWeeklyStats('ZFB', incomeExpense.value),
    ])
    if (id !== loadId) return // 丢弃过期响应
    wechatStats.value = wxResult.data ?? []
    alipayStats.value = zfbResult.data ?? []
  },
  { minDuration: 1000 },
)

function onError(err: unknown) {
  console.error('加载周统计数据失败:', err)
}

onMounted(() => loadStats().catch(onError))
watch(isIncome, () => loadStats().catch(onError))
```

New template:
```html
<div class="rounded-xl border border-default p-4 bg-default">
  <USkeleton v-if="loading" class="h-[400px] w-full rounded-xl" />
  <ChartView
    v-else
    type="line"
    :data="chartData"
    :options="chartOptions"
    height="400px"
  />
</div>
```

- [ ] **Step 2: TypeScript check**

Run: `pnpm typecheck`
Expected: No errors.

- [ ] **Step 3: Manual sanity check — verify pages still render**

Run: `pnpm dev`
- Open WeChatPage (`/bill/wechat`) — table should show loading with min 1s duration
- Toggle income/expense on Dashboard — chart should show Skeleton for min 1s
- Upload a file — button should show loading for min 1s

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/pages/DashboardPage.vue
git commit -m "feat: add useLoading and USkeleton to dashboard chart"
```
