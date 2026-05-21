import { ref } from 'vue'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { minDuration?: number },
) {
  const loading = ref(false)
  let pendingCount = 0

  async function execute(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    pendingCount++
    loading.value = true
    try {
      const [result] = await Promise.all([
        fn(...args),
        delay(options?.minDuration ?? 1000),
      ])
      return result
    } finally {
      pendingCount--
      if (pendingCount === 0) loading.value = false
    }
  }

  return { loading, execute }
}
