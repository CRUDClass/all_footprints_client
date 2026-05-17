<!-- 支付宝账单页：文件上传 + 分页表格展示 -->
<script setup lang="ts">
import type { BillRecord } from '@/data/types'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { useAppStore } from '@/stores'
import type { ColumnDef } from '@tanstack/vue-table'
import { h, onMounted, resolveComponent } from 'vue'
const UBadge = resolveComponent('UBadge')
const appStore = useAppStore()
appStore.setPageTitle('支付宝账单')

// 数据加载与分页
const { bills, total, page, pageSize, loading, loadBills } = useBillData('ZFB')
// 文件上传
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload('ZFB', () => loadBills())

// 表格列定义：映射 BillRecord 字段 → 中文表头
const columns: ColumnDef<BillRecord>[] = [
  { accessorKey: 'tradeTime', header: '交易时间' },
  {
    accessorKey: 'incomeExpense', header: '收入/支出',
    cell: ({ row }) => {
      const color = {
        'INCOME': 'success' as const,
        'EXPENSE': 'error' as const
      }[row.getValue('incomeExpense') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('incomeExpense')
      )
    }
  },
  { accessorKey: 'amount', header: '金额(¥)' },
  { accessorKey: 'tradeNo', header: '交易单号' },
  { accessorKey: 'category', header: '分类' },
  { accessorKey: 'zfbAccount', header: '账户' },
  { accessorKey: 'alipaySource', header: '来源' },
  { accessorKey: 'alipayTags', header: '标签' },
  { accessorKey: 'remark', header: '备注' },
]

onMounted(() => loadBills())
</script>

<template>
  <div>
    <div class="mb-4">
      <!-- 导入按钮：触发隐藏的 file input -->
      <UButton :loading="uploading" :disabled="uploading" icon="i-lucide-upload" @click="triggerFilePicker">
        导入
      </UButton>
      <input ref="fileInput" type="file" hidden accept=".csv" @change="handleFileChange" />
    </div>

    <!-- 账单数据表格 + 底部分页 -->
    <UTable :columns="columns" :data="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :items-per-page="pageSize" />
    </div>
  </div>
</template>
