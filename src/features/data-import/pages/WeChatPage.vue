<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'

const appStore = useAppStore()
appStore.setPageTitle('微信账单')

const { bills, total, page, pageSize, loading, loadBills } = useBillData('WX')
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload('WX', () => loadBills())

const columns = [
  { key: 'tradeTime', label: '交易时间' },
  { key: 'incomeExpense', label: '收入/支出' },
  { key: 'amount', label: '金额' },
  { key: 'tradeNo', label: '交易单号' },
  { key: 'counterparty', label: '交易对方' },
  { key: 'product', label: '商品' },
  { key: 'wxType', label: '交易类型' },
  { key: 'paymentMethod', label: '支付方式' },
  { key: 'status', label: '状态' },
  { key: 'merchantNo', label: '商户单号' },
  { key: 'remark', label: '备注' },
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
        accept=".xlsx,.xls"
        @change="handleFileChange"
      />
    </div>

    <UTable :columns="columns" :rows="bills" :loading="loading" />

    <div class="flex justify-center mt-4">
      <UPagination v-model="page" :total="total" :page-size="pageSize" />
    </div>
  </div>
</template>
