<!-- 首页看板：Chart.js 全年周支出/收入趋势，支持 USwitch 切换 -->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import { fetchWeeklyStats } from '@/data/api/bill'
import type { IncomeExpenseType, WeeklyStatDTO } from '@/data/types'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartView from '@/shared/components/ChartView.vue'
import { useLoading } from '@/shared/composables/useLoading'

const appStore = useAppStore()
appStore.setPageTitle('首页')

// 收入/支出模式切换 (USwitch v-model: false=支出, true=收入)
const isIncome = ref(false)
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

onMounted(() => loadStats().catch(onError))
watch(isIncome, () => loadStats().catch(onError))
</script>

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
      <USkeleton v-if="loading" class="h-[400px] w-full rounded-xl" />
      <ChartView
        v-else
        type="line"
        :data="chartData"
        :options="chartOptions"
        height="400px"
      />
    </div>
  </div>
</template>
