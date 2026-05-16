<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { BillRecord } from '@/data/types'

const appStore = useAppStore()
appStore.setPageTitle('支付宝账单')

const { bills, total, page, pageSize, loading, loadBills } = useBillData('ZFB')
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload('ZFB', () => loadBills())

const columns: ColumnDef<BillRecord>[] = [
  { accessorKey: 'tradeTime', header: '交易时间' },
  { accessorKey: 'incomeExpense', header: '收入/支出' },
  { accessorKey: 'amount', header: '金额' },
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
      <UButton
        :loading="uploading"
        :disabled="uploading"
        icon="i-heroicons-arrow-up-tray"
        @click="triggerFilePicker"
      >
        导入
      </UButton>
      <input
        ref="fileInput"
        type="file"
        hidden
        accept=".csv"
        @change="handleFileChange"
      />
    </div>

    <UTable :columns="columns" :rows="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :page-size="pageSize" />
    </div>
  </div>
</template>
