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
