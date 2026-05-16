<!-- 首页看板：Chart.js 全年周支出趋势 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import ChartView from '@/shared/components/ChartView.vue'
import type { ChartData, ChartOptions } from 'chart.js'

const appStore = useAppStore()
appStore.setPageTitle('首页')

// Sample weekly labels: 第1周 ~ 第52周
const labels = Array.from({ length: 52 }, (_, i) => `第${i + 1}周`)

// Sample weekly expense data for Alipay (blue) and WeChat (green)
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

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  plugins: {
    title: {
      display: true,
      text: '全年每周支出趋势',
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
        text: '支出金额（元）',
      },
    },
    x: {
      ticks: {
        maxTicksLimit: 13,
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
