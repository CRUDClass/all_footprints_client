# 账单导入模块：微信 / 支付宝子页面 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将"账单导入"改为"账单"并添加微信/支付宝子页面，每个页面包含导入按钮和服务端分页表格。

**Architecture:** 底层类型 → API mock → composables → 路由/导航 → WeChat/Alipay 两个页面。页面共用 composables 但各自定义列配置，所有 UI 组件使用 Nuxt UI。

**Tech Stack:** Vue 3 + Nuxt UI 4 + TypeScript + Vue Router 4 + Pinia

---

### Task 1: 定义类型和 API 层

**Files:**
- Modify: `src/data/types/index.ts` — 新增 BillRecord、PaginatedResponse、BillQueryParams、ApiResponse 类型
- Create: `src/data/api/bill.ts` — 账单 API 接口（upload + list），返回 mock 数据

- [ ] **Step 1: 修改 `src/data/types/index.ts`，新增类型定义**

```ts
// 账单交易记录
export interface BillRecord {
  id: number
  source: 'WX' | 'ZFB'
  tradeTime: string
  incomeExpense: 'INCOME' | 'EXPENSE'
  amount: number
  remark: string
  tradeNo: string
  // 微信特有
  counterparty?: string
  product?: string
  wxType?: string
  paymentMethod?: string
  status?: string
  merchantNo?: string
  // 支付宝特有
  category?: string
  zfbAccount?: string
  alipaySource?: string
  alipayTags?: string
  createTime?: string
  createUser?: number
  deleted?: number
}

// 分页请求参数
export interface BillQueryParams {
  page: number
  pageSize: number
  source: 'WX' | 'ZFB'
}

// 分页响应
export interface PaginatedResponse<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
}

// API 统一响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

将此代码追加到现有类型之后。

- [ ] **Step 2: 创建 `src/data/api/bill.ts`**

```ts
import type { ApiResponse, BillQueryParams, BillRecord, PaginatedResponse } from '@/data/types'

// 生成 mock 账单数据
function generateMockBills(source: 'WX' | 'ZFB', count = 20): BillRecord[] {
  const records: BillRecord[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const base: BillRecord = {
      id: i + 1 + Math.floor(Math.random() * 10000),
      source,
      tradeTime: new Date(now - i * 86_400_000).toISOString().slice(0, 19).replace('T', ' '),
      incomeExpense: i % 3 === 0 ? 'INCOME' : 'EXPENSE',
      amount: parseFloat((Math.random() * 1000 + 0.01).toFixed(2)),
      remark: '',
      tradeNo: `${source}${Date.now()}${i}`,
    }

    if (source === 'WX') {
      base.counterparty = ['张三', '美团外卖', '滴滴出行', '瑞幸咖啡', '京东'][i % 5]
      base.product = ['餐饮', '交通', '购物', '饮品', '数码'][i % 5]
      base.wxType = ['商户消费', '转账', '红包', '扫码'][i % 4]
      base.paymentMethod = ['零钱', '银行卡', '零钱通'][i % 3]
      base.status = ['已支付', '已退款', '支付中'][i % 3]
      base.merchantNo = `M${Date.now()}${i}`
    } else {
      base.category = ['餐饮', '交通', '购物', '转账', '生活缴费'][i % 5]
      base.zfbAccount = ['余额宝', '银行卡', '花呗'][i % 3]
      base.alipaySource = ['扫码支付', '商家扣款', '手动记账'][i % 3]
      base.alipayTags = ['餐饮', '日常', '出行', '购物'][i % 4]
    }

    records.push(base)
  }
  return records
}

// POST /api/bills/import — 上传文件导入
export async function uploadBill(file: File): Promise<ApiResponse<null>> {
  // TODO: 替换为真实 API 调用
  console.log('Uploading file:', file.name)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '导入成功', data: null })
    }, 500)
  })
}

// GET /api/bills — 分页查询
export async function fetchBills(params: BillQueryParams): Promise<ApiResponse<PaginatedResponse<BillRecord>>> {
  // TODO: 替换为真实 API 调用: GET /api/bills?page=${params.page}&pageSize=${params.pageSize}&source=${params.source}
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: {
          records: generateMockBills(params.source),
          total: 58,
          page: params.page,
          pageSize: params.pageSize,
        },
      })
    }, 300)
  })
}
```

- [ ] **Step 3: 验证 build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/data/types/index.ts src/data/api/bill.ts
git commit -m "feat: add bill record types and API layer with mock data"
```

---

### Task 2: 创建 Composables

**Files:**
- Create: `src/features/data-import/composables/useBillData.ts`
- Create: `src/features/data-import/composables/useFileUpload.ts`

- [ ] **Step 1: 创建 `src/features/data-import/composables/useBillData.ts`**

```ts
import { ref, watch } from 'vue'
import { fetchBills } from '@/data/api/bill'
import type { BillRecord } from '@/data/types'

export function useBillData(source: 'WX' | 'ZFB') {
  const bills = ref<BillRecord[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const loading = ref(false)

  async function loadBills() {
    loading.value = true
    try {
      const res = await fetchBills({
        page: page.value,
        pageSize: pageSize.value,
        source,
      })
      bills.value = res.data.records
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  // 翻页时自动重新加载
  watch(page, () => loadBills())

  return { bills, total, page, pageSize, loading, loadBills }
}
```

- [ ] **Step 2: 创建 `src/features/data-import/composables/useFileUpload.ts`**

```ts
import { ref } from 'vue'
import { uploadBill } from '@/data/api/bill'

export function useFileUpload(onSuccess: () => void) {
  const uploading = ref(false)
  const fileInput = ref<HTMLInputElement | undefined>()

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploading.value = true
    try {
      await uploadBill(file)
      onSuccess()
    } finally {
      uploading.value = false
      target.value = '' // 重置 input 以允许重复选择同一文件
    }
  }

  function triggerFilePicker() {
    fileInput.value?.click()
  }

  return { uploading, fileInput, handleFileChange, triggerFilePicker }
}
```

- [ ] **Step 3: 验证 build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/features/data-import/composables/
git commit -m "feat: add useBillData and useFileUpload composables"
```

---

### Task 3: 更新路由和导航布局

**Files:**
- Modify: `src/router/index.ts` — 替换 `/data-import` 为 `/bill/wechat` 和 `/bill/alipay`
- Modify: `src/layouts/DefaultLayout.vue` — 侧边栏导航改为嵌套菜单，面包屑兼容新路由
- Delete: `src/features/data-import/pages/DataImportPage.vue`

- [ ] **Step 1: 修改 `src/router/index.ts`**

替换 `data-import` 路由为两个新路由：

```ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/features/dashboard/pages/DashboardPage.vue'),
      },
      {
        path: 'bill/wechat',
        name: 'bill-wechat',
        component: () => import('@/features/data-import/pages/WeChatPage.vue'),
      },
      {
        path: 'bill/alipay',
        name: 'bill-alipay',
        component: () => import('@/features/data-import/pages/AlipayPage.vue'),
      },
    ],
  },
]
```

- [ ] **Step 2: 修改 `src/layouts/DefaultLayout.vue` 导航项和面包屑**

更新 `<script setup>` 中的 `navItems` 和 `breadcrumbItems`：

```ts
const navItems = [
  { label: '首页', icon: 'i-heroicons-home', to: '/' },
  {
    label: '账单',
    icon: 'i-heroicons-arrow-up-tray',
    defaultOpen: true,
    children: [
      { label: '微信', to: '/bill/wechat' },
      { label: '支付宝', to: '/bill/alipay' },
    ],
  },
]

const breadcrumbItems = computed(() => {
  if (route.path === '/') return [{ label: '首页', to: '/' }]
  if (route.path === '/bill/wechat') {
    return [
      { label: '首页', to: '/' },
      { label: '微信', to: '/bill/wechat' },
    ]
  }
  if (route.path === '/bill/alipay') {
    return [
      { label: '首页', to: '/' },
      { label: '支付宝', to: '/bill/alipay' },
    ]
  }
  return [{ label: '首页', to: '/' }]
})
```

模板部分保持不变（USidebar + UNavigationMenu 会自动渲染 children 为嵌套菜单）。

- [ ] **Step 3: 删除旧页面文件**

```bash
rm src/features/data-import/pages/DataImportPage.vue
```

- [ ] **Step 4: 验证 build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/router/index.ts src/layouts/DefaultLayout.vue
git rm src/features/data-import/pages/DataImportPage.vue
git commit -m "feat: update router and nav sidebar with bill submenu"
```

---

### Task 4: 创建微信账单页面

**Files:**
- Create: `src/features/data-import/pages/WeChatPage.vue`

- [ ] **Step 1: 创建 `src/features/data-import/pages/WeChatPage.vue`**

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'

const appStore = useAppStore()
appStore.setPageTitle('微信账单')

const { bills, total, page, pageSize, loading, loadBills } = useBillData('WX')
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload(() => loadBills())

const columns = [
  { key: 'tradeTime', label: '交易时间' },
  { key: 'incomeExpense', label: '收入/支出' },
  { key: 'amount', label: '金额' },
  { key: 'tradeNo', label: '交易单号' },
  { key: 'counterparty', label: '交易对方' },
  { key: 'product', label: '商品' },
  { key: 'wxType', label: '交易类型' },
  { key: 'paymentMethod', label: '支付方式' },
  { key: 'status', label: '状态' },
  { key: 'merchantNo', label: '商户单号' },
  { key: 'remark', label: '备注' },
]

onMounted(() => loadBills())
</script>

<template>
  <div>
    <div class="mb-4">
      <UButton
        :loading="uploading"
        :disabled="uploading"
        icon="i-heroicons-arrow-up-tray"
        @click="triggerFilePicker"
      >
        导入
      </UButton>
      <input
        ref="fileInput"
        type="file"
        hidden
        accept=".xlsx,.xls"
        @change="handleFileChange"
      />
    </div>

    <UTable :columns="columns" :rows="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :page-size="pageSize" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: 验证 build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/features/data-import/pages/WeChatPage.vue
git commit -m "feat: add WeChat bill page with import and paginated table"
```

---

### Task 5: 创建支付宝账单页面

**Files:**
- Create: `src/features/data-import/pages/AlipayPage.vue`

- [ ] **Step 1: 创建 `src/features/data-import/pages/AlipayPage.vue`**

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'

const appStore = useAppStore()
appStore.setPageTitle('支付宝账单')

const { bills, total, page, pageSize, loading, loadBills } = useBillData('ZFB')
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload(() => loadBills())

const columns = [
  { key: 'tradeTime', label: '交易时间' },
  { key: 'incomeExpense', label: '收入/支出' },
  { key: 'amount', label: '金额' },
  { key: 'tradeNo', label: '交易单号' },
  { key: 'category', label: '分类' },
  { key: 'zfbAccount', label: '账户' },
  { key: 'alipaySource', label: '来源' },
  { key: 'alipayTags', label: '标签' },
  { key: 'remark', label: '备注' },
]

onMounted(() => loadBills())
</script>

<template>
  <div>
    <div class="mb-4">
      <UButton
        :loading="uploading"
        :disabled="uploading"
        icon="i-heroicons-arrow-up-tray"
        @click="triggerFilePicker"
      >
        导入
      </UButton>
      <input
        ref="fileInput"
        type="file"
        hidden
        accept=".csv"
        @change="handleFileChange"
      />
    </div>

    <UTable :columns="columns" :rows="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :page-size="pageSize" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: 验证 build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/features/data-import/pages/AlipayPage.vue
git commit -m "feat: add Alipay bill page with import and paginated table"
```

---

### Self-Review Checklist

1. **Spec coverage:**
   - 导航改为"账单" + 子菜单 ✅ (Task 3)
   - 路由 `/bill/wechat` 和 `/bill/alipay` ✅ (Task 3)
   - 两个页面含导入按钮 + UTable + UPagination ✅ (Task 4, 5)
   - 微信列含公共 + 特有字段，备注最后 ✅ (Task 4)
   - 支付宝列含公共 + 特有字段，备注最后 ✅ (Task 5)
   - id 列隐藏 ✅ (不在 columns 中)
   - 服务端分页（GET 请求） ✅ (Task 1, 2)
   - 所有组件使用 Nuxt UI ✅
   - 旧 DataImportPage.vue 删除 ✅ (Task 3)

2. **Placeholder scan:** 无 TBD/TODO/不完整代码。API 函数中有 `// TODO: 替换为真实 API 调用` 标记，这是有意的过渡标记（mock 替换指示），非占位符。

3. **Type consistency:** BillRecord 类型在 Task 1 定义，Task 2 composables 引用，Task 4/5 页面引用，字段名一致。
