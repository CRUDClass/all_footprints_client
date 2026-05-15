import { ref } from 'vue'
import { uploadBill } from '@/data/api/bill'

export function useFileUpload(onSuccess: () => void) {
  const uploading = ref(false)
  const fileInput = ref<HTMLInputElement | undefined>()

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    uploading.value = true
    try {
      await uploadBill(file)
      onSuccess()
    } finally {
      uploading.value = false
      target.value = '' // 重置 input 以允许重复选择同一文件
    }
  }

  function triggerFilePicker() {
    fileInput.value?.click()
  }

  return { uploading, fileInput, handleFileChange, triggerFilePicker }
}
