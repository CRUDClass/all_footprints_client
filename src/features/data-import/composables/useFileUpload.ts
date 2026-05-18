import { ref } from 'vue'
import { uploadBill } from '@/data/api/bill'
import { useLoading } from '@/shared/composables/useLoading'

/**
 * 文件上传：隐藏 input + 按钮触发，上传成功后回调刷新数据
 * @param source - 数据来源 'WX' | 'ZFB'
 * @param onSuccess - 上传成功后的回调（通常用于重新加载列表）
 */
export function useFileUpload(source: 'WX' | 'ZFB', onSuccess: () => void) {
  const fileInput = ref<HTMLInputElement | undefined>()

  const { loading: uploading, execute: doUpload } = useLoading(
    async (file: File) => {
      try {
        await uploadBill(file, source)
        onSuccess()
      } catch (e) {
        console.error('文件上传失败:', e)
      }
    },
    { minDuration: 1000 },
  )

  /** 文件选择后的上传处理 */
  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
      await doUpload(file)
    } finally {
      // 重置 input 以允许重复选择同一文件
      target.value = ''
    }
  }

  /** 触发隐藏的文件选择器 */
  function triggerFilePicker() {
    fileInput.value?.click()
  }

  return { uploading, fileInput, handleFileChange, triggerFilePicker }
}
