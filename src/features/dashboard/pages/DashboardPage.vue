<!-- 首页看板：ECharts 数据可视化展示 -->
<script setup lang="ts">
import { useAppStore } from '@/stores'
import ECharts from '@/shared/components/ECharts.vue'
import { computed } from 'vue'

const appStore = useAppStore()
appStore.setPageTitle('首页')

// 月度收支柱状图（示例数据）
const barOption = computed(() => ({
  title: { text: '月度收支', left: 'center' },
  tooltip: { trigger: 'axis' as const },
  legend: { data: ['收入', '支出'], bottom: 0 },
  xAxis: { type: 'category' as const, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' as const },
  series: [
    {
      name: '收入',
      type: 'bar' as const,
      data: [12800, 13500, 14200, 13100, 14800, 15200],
      itemStyle: { color: '#22c55e' },
    },
    {
      name: '支出',
      type: 'bar' as const,
      data: [6200, 7800, 7100, 8400, 6900, 8100],
      itemStyle: { color: '#ef4444' },
    },
  ],
}))

// 支出分类饼图（示例数据）
const pieOption = computed(() => ({
  title: { text: '支出分类', left: 'center' },
  tooltip: { trigger: 'item' as const, formatter: '{b}: {c}元 ({d}%)' },
  series: [
    {
      type: 'pie' as const,
      radius: ['40%', '65%'],
      center: ['50%', '55%'],
      data: [
        { name: '餐饮', value: 3200 },
        { name: '交通', value: 1200 },
        { name: '购物', value: 2100 },
        { name: '娱乐', value: 800 },
        { name: '住房', value: 2500 },
        { name: '其他', value: 900 },
      ],
      label: { show: true, formatter: '{b}' },
    },
  ],
}))

// 余额趋势折线图（示例数据）
const lineOption = computed(() => ({
  title: { text: '账户余额趋势', left: 'center' },
  tooltip: { trigger: 'axis' as const },
  xAxis: { type: 'category' as const, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' as const },
  series: [
    {
      type: 'line' as const,
      data: [8500, 9200, 8800, 9600, 10200, 9800],
      smooth: true,
      areaStyle: { opacity: 0.3 },
      itemStyle: { color: '#3b82f6' },
    },
  ],
}))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">首页看板</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-xl border border-default p-4 bg-default">
        <ECharts :option="barOption" class="h-[320px]" />
      </div>
      <div class="rounded-xl border border-default p-4 bg-default">
        <ECharts :option="pieOption" class="h-[320px]" />
      </div>
      <div class="rounded-xl border border-default p-4 bg-default lg:col-span-2">
        <ECharts :option="lineOption" class="h-[300px]" />
      </div>
    </div>
  </div>
</template>
