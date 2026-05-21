---
name: chart-gen
description: Chart.js 配置生成器 — 提供项目内图表模板（折线图/柱状图/饼图/环形图/雷达图），含 TypeScript 类型标注、暗色主题适配、工具提示金额格式化
---

# chart-gen

适用于 `all-footprints-client` 项目的 Chart.js 配置模板。调用此 skill 后，根据需求选择合适的模板生成代码。

## 通用规则

- **类型标注**：所有 `ChartOptions` 必须显式标注泛型类型（如 `ChartOptions<'line'>`），不使用 `ChartOptions` 裸类型
- **金额单位**：tooltip 金额统一显示为 `元`，格式化为 `toFixed(2)` 保留两位小数
- **暗色模式**：通过 `useDark()` 控制文字/网格颜色，引用已有的 `ChartView.vue` 组件时会自动适配
- **复用组件**：优先使用 `src/shared/components/ChartView.vue`，不要自行创建 `canvas` + `new Chart()`

## 使用方式

此 skill 提供以下配置模板：

1. [折线图（line）](#1-折线图模板)
2. [柱状图（bar）](#2-柱状图模板)
3. [环形图（doughnut）](#3-环形图模板)
4. [饼图（pie）](#4-饼图模板)
5. [雷达图（radar）](#5-雷达图模板)
6. [跨年对比折线图](#6-跨年对比折线图模板)

## 1. 折线图模板

适用场景：年度周趋势、月变化、时间序列。参考 `DashboardPage.vue` 中的折线图。

```ts
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const isDark = useDark()
const textColor = computed(() => (isDark.value ? '#e5e7eb' : '#4b5563'))
const gridColor = computed(() => (isDark.value ? '#374151' : '#e5e7eb'))

const labels = ['1月', '2月', '3月', '4月', '5月']

const chartData = computed<ChartData<'line'>>(() => ({
  labels,
  datasets: [
    {
      label: '数据集名称',
      data: [120, 200, 150, 80, 70],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 4,
      fill: false,
      tension: 0.3,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '标题',
      font: { size: 16, weight: 500 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)}元`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: textColor.value },
      grid: { color: gridColor.value },
    },
    y: {
      beginAtZero: true,
      ticks: { color: textColor.value },
      grid: { color: gridColor.value },
      title: { display: true, text: '金额（元）' },
    },
  },
}))
```

模板用法：

```vue
<ChartView type="line" :data="chartData" :options="chartOptions" height="400px" />
```

## 2. 柱状图模板

适用场景：分类对比（各月支出、各平台对比）。

```ts
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const isDark = useDark()
const textColor = computed(() => (isDark.value ? '#e5e7eb' : '#4b5563'))
const gridColor = computed(() => (isDark.value ? '#374151' : '#e5e7eb'))

const labels = ['微信', '支付宝', '现金', '信用卡']

const chartData = computed<ChartData<'bar'>>(() => ({
  labels,
  datasets: [
    {
      label: '支出',
      data: [5200, 3800, 1200, 2800],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(239, 68, 68, 0.7)',
      ],
      borderColor: [
        '#3b82f6',
        '#22c55e',
        '#eab308',
        '#ef4444',
      ],
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '各支付方式支出对比',
      font: { size: 16, weight: 500 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)}元`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: textColor.value },
      grid: { color: gridColor.value },
    },
    y: {
      beginAtZero: true,
      ticks: { color: textColor.value },
      grid: { color: gridColor.value },
      title: { display: true, text: '金额（元）' },
    },
  },
}))
```

## 3. 环形图模板

适用场景：分类占比（支出类别分布、收入来源占比）。

```ts
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['餐饮', '交通', '购物', '娱乐', '其他'],
  datasets: [
    {
      data: [3500, 800, 2100, 600, 1200],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderWidth: 2,
      borderColor: 'transparent',
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    title: {
      display: true,
      text: '支出类别分布',
      font: { size: 16, weight: 500 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = ((ctx.parsed / total) * 100).toFixed(1)
          return `${ctx.label}: ${ctx.parsed.toFixed(2)}元 (${pct}%)`
        },
      },
    },
    legend: {
      position: 'right',
      labels: { font: { size: 12 } },
    },
  },
}))
```

## 4. 饼图模板

同环形图，只需改 `type="pie"`，ChartOptions 类型改为 `ChartOptions<'pie'>`。环形图更推荐。

## 5. 雷达图模板

适用场景：多维度对比（月各维度评分）。

```ts
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: ['餐饮', '交通', '购物', '娱乐', '住房', '教育'],
  datasets: [
    {
      label: '本月',
      data: [1200, 300, 800, 400, 2000, 600],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      pointRadius: 4,
    },
    {
      label: '上月',
      data: [1500, 250, 1000, 350, 2000, 500],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      pointRadius: 4,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '消费结构对比',
      font: { size: 16, weight: 500 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.r?.toFixed(2)}元`,
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      ticks: {
        stepSize: 500,
      },
    },
  },
}))
```

## 6. 跨年对比折线图模板

适用场景：两年同期趋势对比（需从 API 取两年数据）。

```ts
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'

const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)

const chartData = computed<ChartData<'line'>>(() => ({
  labels,
  datasets: [
    {
      label: '2025年',
      data: [1200, 1800, 1500, 2100, 1900, 2200, 2000, 2300, 2100, 2500, 2400, 2800],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.3,
      fill: false,
    },
    {
      label: '2026年',
      data: [1400, 2000, 1700, 2300, 2100, 2400],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.3,
      fill: false,
      borderDash: [5, 5], // 虚线区分当前年（未结束）
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '月支出跨年对比',
      font: { size: 16, weight: 500 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)}元`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: '金额（元）' },
    },
  },
}))
```

## ChartView 组件说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `ChartType` | 必填 | 图表类型：`'line'`、`'bar'`、`'doughnut'`、`'pie'`、`'radar'` 等 |
| `data` | `ChartData` | 必填 | Chart.js 数据集配置 |
| `options` | `ChartOptions` | `{}` | 图表选项（会与内置的暗色主题选项 merge） |
| `height` | `string` | `'300px'` | 图表容器高度 |

内置行为：
- 自动注册所有 Chart.js 组件（`Chart.register(...registerables)`）
- 自动监听 `useDark()` 变化，切换文字和网格颜色
- 响应式自适应容器宽度
