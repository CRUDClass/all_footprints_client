<script setup lang="ts">
import { useAppStore } from '@/stores'
import { useBillData } from '@/features/data-import/composables/useBillData'
import { useFileUpload } from '@/features/data-import/composables/useFileUpload'
import { onMounted } from 'vue'

const appStore = useAppStore()
appStore.setPageTitle('支付宝账单')

const { bills, total, page, pageSize, loading, loadBills } = useBillData('ZFB')
const { uploading, fileInput, handleFileChange, triggerFilePicker } = useFileUpload(() => loadBills())

const columns = [
  { key: 'tradeTime', label: '交易时间' },
  { key: 'incomeExpense', label: '收入/支出' },
  { key: 'amount', label: '金额' },
  { key: 'tradeNo', label: '交易单号' },
  { key: 'category', label: '分类' },
  { key: 'zfbAccount', label: '账户' },
  { key: 'alipaySource', label: '来源' },
  { key: 'alipayTags', label: '标签' },
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
