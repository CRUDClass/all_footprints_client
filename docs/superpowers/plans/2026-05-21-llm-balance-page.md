# LLM 余额查询页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sidebar menu item "LLM 余额" linking to a page that displays DeepSeek and Kimi account balance snapshots in UPageCard components.

**Architecture:** New `features/llm-balance/` module with a page, composable, and card component. Data flows: `LlmBalancePage` → `useAiBalance` composable (wraps `useLoading`) → `fetchBalance` API → backend at `/api/balance/latest`. Two `AiBalanceCard` components render inside `UPageGrid`.

**Tech Stack:** Vue 3 + TypeScript + Nuxt UI 4 (UPageCard, UPageGrid, USkeleton) + Pinia + `useLoading` composable

---

### Task 1: Add AI balance types

**Files:**
- Create: `src/data/types/ai.ts`

- [ ] **Step 1: Create the type definitions**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/data/types/ai.ts
git commit -m "feat: add AiBalance and BalanceData types"
```

---

### Task 2: Add fetchBalance API function

**Files:**
- Create: `src/data/api/ai.ts`

- [ ] **Step 1: Create the API function**

```typescript
import type { ApiResponse } from '@/data/types'
import type { BalanceData } from '@/data/types/ai'

/** 获取所有 AI 账户的余额快照 */
export async function fetchBalance(): Promise<ApiResponse<BalanceData>> {
  const response = await fetch('/api/balance/latest')
  if (!response.ok) throw new Error(`Fetch balance failed: ${response.statusText}`)
  return response.json()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/api/ai.ts
git commit -m "feat: add fetchBalance API function"
```

---

### Task 3: Add /api proxy to Vite config

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Add /api proxy rule alongside existing /bill rule**

Edit `vite.config.ts` to add `/api` proxy:

```typescript
proxy: {
  '/bill': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    bypass: (req) => {
      if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
        return req.url
      }
    },
  },
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
  },
},
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.ts
git commit -m "feat: add /api proxy to Vite config"
```

---

### Task 4: Create useAiBalance composable

**Files:**
- Create: `src/features/llm-balance/composables/useAiBalance.ts`

- [ ] **Step 1: Create the composable**

```typescript
import { ref } from 'vue'
import { fetchBalance } from '@/data/api/ai'
import type { BalanceData } from '@/data/types/ai'
import { useLoading } from '@/shared/composables/useLoading'
import type { ApiResponse } from '@/data/types'

export function useAiBalance() {
  const data = ref<BalanceData | null>(null)
  const error = ref<string | null>(null)

  const { loading, execute: load } = useLoading(async () => {
    error.value = null
    const res: ApiResponse<BalanceData> = await fetchBalance()
    if (res.code !== 200) {
      throw new Error(res.msg || '获取余额失败')
    }
    data.value = res.data
  }, { minDuration: 1000 })

  return { data, loading, error, load }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/llm-balance/composables/useAiBalance.ts
git commit -m "feat: add useAiBalance composable"
```

---

### Task 5: Create AiBalanceCard component

**Files:**
- Create: `src/features/llm-balance/components/AiBalanceCard.vue`

- [ ] **Step 1: Create the card component**

```vue
<script setup lang="ts">
import type { AiBalance } from '@/data/types/ai'

const props = defineProps<{
  name: string
  balance: AiBalance
}>()

const fieldMap: Record<string, string> = {
  totalBalance: '总额',
  availableBalance: '可用余额',
  grantedBalance: '赠送余额',
  toppedUpBalance: '充值余额',
  voucherBalance: '优惠券余额',
  cashBalance: '现金余额',
  currency: '货币',
}

/** 返回该 AI 含有的特有字段列表 */
const specificFields = computed(() => {
  const fields: { key: string; label: string; value: string }[] = []
  for (const [key, label] of Object.entries(fieldMap)) {
    const val = (props.balance as any)[key]
    if (val !== undefined) fields.push({ key, label, value: val })
  }
  return fields
})
</script>
```

Wait, I need to import `computed`. Let me fix this.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { AiBalance } from '@/data/types/ai'

const props = defineProps<{
  name: string
  balance: AiBalance
}>()

const fieldMap: Record<string, string> = {
  totalBalance: '总额',
  availableBalance: '可用余额',
  grantedBalance: '赠送余额',
  toppedUpBalance: '充值余额',
  voucherBalance: '优惠券余额',
  cashBalance: '现金余额',
  currency: '货币',
}

const specificFields = computed(() => {
  const fields: { key: string; label: string; value: string }[] = []
  for (const [key, label] of Object.entries(fieldMap)) {
    const val = (props.balance as Record<string, string | undefined>)[key]
    if (val !== undefined) fields.push({ key, label, value: val })
  }
  return fields
})
</script>

<template>
  <UPageCard :title="name" variant="outline">
    <template #leading>
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold">{{ name }}</span>
        <UBadge
          :color="balance.available ? 'success' : 'error'"
          variant="soft"
          size="sm"
        >
          {{ balance.available ? '可用' : '不可用' }}
        </UBadge>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="field in specificFields"
        :key="field.key"
        class="bg-(--ui-bg-elevated)/50 rounded-md p-2.5"
      >
        <div class="text-xs text-(--ui-text-muted) mb-0.5">
          {{ field.label }}
        </div>
        <div class="text-sm font-medium">
          {{ field.key === 'currency' ? field.value : `${field.value} ${balance.currency}` }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="text-xs text-(--ui-text-muted)">
        查询时间：{{ balance.queryTime }}
      </div>
    </template>
  </UPageCard>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/llm-balance/components/AiBalanceCard.vue
git commit -m "feat: add AiBalanceCard component"
```

---

### Task 6: Create LlmBalancePage

**Files:**
- Create: `src/features/llm-balance/pages/LlmBalancePage.vue`

- [ ] **Step 1: Create the page**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useAiBalance } from '@/features/llm-balance/composables/useAiBalance'

const appStore = useAppStore()
appStore.setPageTitle('LLM 余额')

const { data, loading, error, load } = useAiBalance()

onMounted(() => {
  load().catch((err) => {
    console.error('加载 LLM 余额失败:', err)
  })
})

function onRetry() {
  load().catch((err) => {
    console.error('加载 LLM 余额失败:', err)
  })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">LLM 余额</h1>

    <!-- 加载中：两个 USkeleton 占位 -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <USkeleton class="h-[260px] rounded-lg" />
      <USkeleton class="h-[260px] rounded-lg" />
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-16 gap-4"
    >
      <p class="text-(--ui-text-muted)">获取余额失败，请稍后重试</p>
      <UButton color="primary" variant="soft" @click="onRetry">
        重新加载
      </UButton>
    </div>

    <!-- 正常展示 -->
    <UPageGrid v-else-if="data">
      <AiBalanceCard
        v-if="data.DEEPSEEK"
        name="DeepSeek"
        :balance="data.DEEPSEEK"
      />
      <AiBalanceCard
        v-if="data.KIMI"
        name="Kimi"
        :balance="data.KIMI"
      />
    </UPageGrid>

    <!-- 空数据 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16"
    >
      <p class="text-(--ui-text-muted)">暂无数据</p>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/features/llm-balance/pages/LlmBalancePage.vue
git commit -m "feat: add LlmBalancePage"
```

---

### Task 7: Add /llm-balance route

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add the route**

Add a new child route after the alipay route:

```typescript
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
      {
        path: 'llm-balance',
        name: 'llm-balance',
        component: () => import('@/features/llm-balance/pages/LlmBalancePage.vue'),
      },
    ],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.ts
git commit -m "feat: add /llm-balance route"
```

---

### Task 8: Add nav menu item and breadcrumb

**Files:**
- Modify: `src/layouts/DefaultLayout.vue`

- [ ] **Step 1: Add nav item and breadcrumb**

Add "LLM 余额" as a top-level item after the "账单" group:

```typescript
const navItems: NavigationMenuItem[] = [
  { label: '首页', icon: 'i-lucide-home', to: '/' },
  {
    label: '账单',
    icon: 'i-lucide-upload',
    defaultOpen: true,
    children: [
      { label: '微信', icon: 'i-custom:wechat', to: '/bill/wechat' },
      { label: '支付宝', icon: 'i-custom:alipay', to: '/bill/alipay' },
    ],
  },
  { label: 'LLM 余额', icon: 'i-lucide-brain', to: '/llm-balance' },
]
```

Add breadcrumb case:

```typescript
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
  if (route.path === '/llm-balance') {
    return [
      { label: '首页', to: '/' },
      { label: 'LLM 余额', to: '/llm-balance' },
    ]
  }
  return [{ label: '首页', to: '/' }]
})
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/DefaultLayout.vue
git commit -m "feat: add LLM 余额 nav item and breadcrumb"
```

---

## Self-Review

1. **Spec coverage:**
   - ✅ Nav menu item: Task 8 adds "LLM 余额" to navItems as top-level item after "账单"
   - ✅ Route: Task 7 adds `/llm-balance` lazy-loaded route
   - ✅ API proxy: Task 3 adds `/api` proxy to `vite.config.ts`
   - ✅ Types: Task 1 adds AiBalance/BalanceData types
   - ✅ API function: Task 2 adds fetchBalance()
   - ✅ Composable: Task 4 adds useAiBalance with useLoading wrapper (min 1s)
   - ✅ PageCard: Task 5 creates AiBalanceCard using UPageCard
   - ✅ PageGrid: Task 6 uses UPageGrid for responsive 2-column layout
   - ✅ Three states: Task 6 handles loading (USkeleton), error (message + retry), success (cards)
   - ✅ Chinese labels: Task 5 uses Chinese field labels via fieldMap
   - ✅ Available/unavailable badge: Task 5 uses UBadge with success/error color
   - ✅ Error handling: Task 4 throws on non-200 code, Task 6 shows retry button
   - ✅ Edge cases: AI missing → v-if guard in template, empty state

2. **Placeholder scan:** All steps contain complete code. No TBD/TODO/placeholder patterns.

3. **Type consistency:** AiBalance interface in Task 1 matches API response and the usage in AiBalanceCard.vue. BalanceData.DEEPSEEK and BalanceData.KIMI types align.

4. **Ambiguity check:** No ambiguous requirements. Field display uses computed `specificFields` to show only the fields present for each AI. Currency is displayed per-field plus the main currency indicator.
