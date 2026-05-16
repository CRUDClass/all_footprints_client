# Chart.js 4.5.1 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Chart.js 4.5.1 and replace the broken ECharts dashboard with a working weekly-expense line chart.

**Architecture:** Create a reusable `ChartView.vue` component wrapping Chart.js lifecycle, then update `DashboardPage.vue` to use it with a dual-line (WeChat/Alipay) weekly expense chart using sample data.

**Tech Stack:** Chart.js 4.5.1, Vue 3 Composition API, @vueuse/core `useDark`

---

### Task 1: Install chart.js dependency

**Files:**
- Modify: `package.json`
- Create: `pnpm-lock.yaml` (auto-generated)

- [ ] **Step 1: Install chart.js 4.5.1**

Run: `pnpm add chart.js@^4.5.1`

Expected output: `+ chart.js 4.5.1` in the install log, `"chart.js": "^4.5.1"` added to `package.json` dependencies.

- [ ] **Step 2: Verify import**

Run: `node -e "require('chart.js')"`
Expected: no error (runs silently)

---

### Task 2: Create ChartView.vue reusable component

**Files:**
- Create: `src/shared/components/ChartView.vue`

This component wraps Chart.js with proper Vue lifecycle management and dark mode adaptation.

- [ ] **Step 1: Create ChartView.vue**

New file at `src/shared/components/ChartView.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useDark } from '@vueuse/core'
import {
  Chart,
  type ChartType,
  type ChartData,
  type ChartOptions,
  registerables,
} from 'chart.js'

Chart.register(...registerables)

const props = withDefaults(
  defineProps<{
    type: ChartType
    data: ChartData
    options?: ChartOptions
    height?: string
  }>(),
  {
    height: '300px',
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const isDark = useDark()

const textColor = computed(() => (isDark.value ? '#e5e7eb' : '#4b5563'))
const gridColor = computed(() => (isDark.value ? '#374151' : '#e5e7eb'))

function createChart() {
  if (!canvasRef.value) return

  const mergedOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor.value,
    borderColor: gridColor.value,
    plugins: {
      legend: {
        labels: { color: textColor.value },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor.value },
        ticks: { color: textColor.value },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor.value },
        ticks: { color: textColor.value },
      },
    },
    ...props.options,
  }

  chartInstance = new Chart(canvasRef.value, {
    type: props.type,
    data: props.data,
    options: mergedOptions,
  })
}

function updateChart() {
  if (!chartInstance) return
  chartInstance.data = props.data

  const mergedOptions: ChartOptions = {
    color: textColor.value,
    borderColor: gridColor.value,
    plugins: {
      legend: {
        labels: { color: textColor.value },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor.value },
        ticks: { color: textColor.value },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor.value },
        ticks: { color: textColor.value },
      },
    },
    ...props.options,
  }

  chartInstance.options = mergedOptions
  chartInstance.update()
}

onMounted(createChart)

watch([() => props.data, () => props.options], updateChart, { deep: true })

watch(isDark, updateChart)

onUnmounted(() => {
  chartInstance?.destroy()
  chartInstance = null
})
</script>

<template>
  <div :style="{ height }" class="relative">
    <canvas ref="canvasRef" />
  </div>
</template>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la src/shared/components/ChartView.vue`
Expected: file exists, not empty

---

### Task 3: Update DashboardPage.vue — replace ECharts with Chart.js line chart

**Files:**
- Modify: `src/features/dashboard/pages/DashboardPage.vue`

Replace the entire file content. Remove all ECharts code, add a single dual-line Chart.js chart with 52 weeks of sample data.

- [ ] **Step 1: Write the new DashboardPage.vue**

```vue
<!-- 首页看板：Chart.js 全年周支出趋势 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import ChartView from '@/shared/components/ChartView.vue'
import type { ChartData } from 'chart.js'

const appStore = useAppStore()
appStore.setPageTitle('首页')

// Sample weekly labels: 第1周 ~ 第52周
const labels = Array.from({ length: 52 }, (_, i) => `第${i + 1}周`)

// Sample weekly expense data for Alipay (blue) and WeChat (green)
// Simulates realistic patterns: higher spend around holidays (weeks 1-2 New Year, weeks 18-19 May Day, weeks 40-41 National Day), lower during regular weeks
const alipayData = [
  2800, 3200, 1800, 1600, 1500, 1900, 1700, 2100, 1400, 1600,
  1700, 1500, 1800, 2200, 1900, 1600, 1700, 2500, 2800, 1400,
  1500, 1600, 1800, 1700, 1900, 1500, 1400, 1600, 1700, 1800,
  1500, 1600, 1800, 1700, 1900, 1500, 2000, 1800, 2600, 3000,
  1700, 1600, 1500, 1800, 1700, 1900, 2100, 2200, 2400, 2000,
  1800, 1600,
]

const wechatData = [
  2200, 2800, 1600, 1400, 1300, 1700, 1500, 1800, 1200, 1400,
  1500, 1300, 1600, 1900, 1700, 1400, 1500, 2200, 2400, 1200,
  1300, 1400, 1600, 1500, 1700, 1300, 1200, 1400, 1500, 1600,
  1300, 1400, 1600, 1500, 1700, 1300, 1800, 1600, 2300, 2600,
  1500, 1400, 1300, 1600, 1500, 1700, 1800, 1900, 2100, 1800,
  1600, 1400,
]

const chartData = computed<ChartData<'line'>>(() => ({
  labels,
  datasets: [
    {
      label: '支付宝',
      data: alipayData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      tension: 0.3,
    },
    {
      label: '微信',
      data: wechatData,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      tension: 0.3,
    },
  ],
}))

const chartOptions = computed(() => ({
  plugins: {
    title: {
      display: true,
      text: '全年每周支出趋势',
      font: { size: 16, weight: '500' as const },
      padding: { bottom: 20 },
    },
    tooltip: {
      callbacks: {
        label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
          `${ctx.dataset.label}: ${ctx.parsed.y}元`,
      },
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: '支出金额（元）',
      },
    },
    x: {
      ticks: {
        maxTicksLimit: 13, // show roughly every 4th week
      },
    },
  },
}))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">首页看板</h1>
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

- [ ] **Step 2: Verify the file content**

Run: `head -5 src/features/dashboard/pages/DashboardPage.vue`
Expected: shows `<script setup lang="ts">` and Chart.js imports (no ECharts reference)

---

### Task 4: Verify build and type checking

- [ ] **Step 1: Run type checking**

Run: `pnpm typecheck`
Expected: no errors (vue-tsc should resolve ChartView.vue and chart.js types)

- [ ] **Step 2: Run dev server**

Run: `pnpm dev`
Expected: starts Vite dev server at `http://localhost:5173`

- [ ] **Step 3: Verify in browser**

Open `http://localhost:5173` — confirm:
- Dashboard shows the line chart with the title "全年每周支出趋势"
- Two lines: blue (支付宝) and green (微信)
- X-axis shows week labels ("第1周", "第5周", etc.)
- Y-axis shows expense amount (元)
- Chart is responsive and fills the container
- (Optional) Toggle dark/light mode — chart colors adapt

- [ ] **Step 4: Run production build**

Run: `pnpm build`
Expected: Vite build succeeds with no errors

---

### Self-Review Checklist

- [ ] Spec coverage: Design requires (1) Chart.js dep, (2) reusable wrapper, (3) single dual-line chart, (4) sample data, (5) dark mode — all covered across Tasks 1-4
- [ ] No placeholders: All code blocks contain complete, working code
- [ ] Type consistency: `ChartData<'line'>` matches `type="line"` in template, `ChartOptions` from chart.js matches all options used
