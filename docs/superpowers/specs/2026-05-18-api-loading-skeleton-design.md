# API Loading + Skeleton 设计文档

## 需求

API 访问时增加 loading 指示，满足：
- 最少显示 1s
- 如果 API 超过 1s，则按 API 实际耗时显示
- 结合 Nuxt UI Skeleton 提升加载体验

## 核心逻辑

```
loading = true
await Promise.all([
  fn(...args),       // 实际 API 请求
  delay(minDuration), // 最少 1s 计时器（同时启动）
])
loading = false
```

- API 0.3s 返回 → 等满 1s 计时器 → loading 共 1s
- API 2.5s 返回 → 2.5s 时两者都完成 → loading 共 2.5s

## `useLoading` composable

文件：`shared/composables/useLoading.ts`

```ts
export function useLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { minDuration?: number },  // 默认 1000ms
) {
  const loading = ref(false)

  async function execute(...args: Parameters<T>): Promise<ReturnType<T>> {
    loading.value = true
    try {
      const [result] = await Promise.all([
        fn(...args),
        delay(options?.minDuration ?? 1000),
      ])
      return result
    } finally {
      loading.value = false
    }
  }

  return { loading, execute }
}
```

## 现有代码改动

### `useBillData.ts`
- 删除手动 `loading.value = true/false` 逻辑
- 用 `useLoading(fetchBills)` 替换，返回的 `loading` 绑定到 UTable

### `DashboardPage.vue`
- 用 `useLoading` 包裹 `loadStats` 闭包
- 结构：`useLoading` 内部 `Promise.all([ delay(1000), async () => Promise.all([WX, ZFB]) ])`，外层 Promise.all 负责 minDuration，内层负责并行请求两个数据源
- 保留现有 `loadId` 竞态保护，因 minDuration 不解决快速切换（收入/支出）导致的多请求问题
- loading 时用 `<USkeleton class="h-[400px] w-full rounded-xl" />` 替代 ChartView

### `useFileUpload.ts`
- 替换手动 `uploading = ref(false)` 为 `useLoading(uploadBill)`
- loading 绑定到 UButton

## Skeleton 使用

- **看板页图表**：在 `loading` 时显示 `<USkeleton class="h-[400px] w-full rounded-xl" />`
- **表格页**：UTable 的 `:loading` prop 已有行内加载提示，暂不加 Skeleton

## 不做的事

- 全局请求拦截器（项目小，不需要）
- 全局 loading bar（精确到组件级别就够了）
