export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat('zh-CN').format(n)
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date))
}
