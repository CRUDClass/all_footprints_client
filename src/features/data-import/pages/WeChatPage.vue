<!-- 微信账单页：文件上传 + 分页表格展示 -->
<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { BillRecord } from '@/data/types'

const appStore = useAppStore()
appStore.setPageTitle('微信账单')

// 数据加载与分页
const { bills, total, page, pageSize, loading, loadBills } = useBillData('WX')
// 文件上传
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload('WX', () => loadBills())

// 表格列定义：映射 BillRecord 字段 → 中文表头
const columns: ColumnDef<BillRecord>[] = [
  { accessorKey: 'tradeTime', header: '交易时间' },
  { accessorKey: 'incomeExpense', header: '收入/支出' },
  { accessorKey: 'amount', header: '金额' },
  { accessorKey: 'tradeNo', header: '交易单号' },
  { accessorKey: 'counterparty', header: '交易对方' },
  { accessorKey: 'product', header: '商品' },
  { accessorKey: 'wxType', header: '交易类型' },
  { accessorKey: 'paymentMethod', header: '支付方式' },
  { accessorKey: 'status', header: '状态' },
  { accessorKey: 'merchantNo', header: '商户单号' },
  { accessorKey: 'remark', header: '备注' },
]

onMounted(() => loadBills())
</script>

<template>
  <div>
    <div class="mb-4">
      <!-- 导入按钮：触发隐藏的 file input -->
      <UButton
        :loading="uploading"
        :disabled="uploading"
        icon="i-lucide-upload"
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

    <!-- 账单数据表格 + 底部分页 -->
    <UTable :columns="columns" :data="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :items-per-page="pageSize" />
    </div>
  </div>
</template>
