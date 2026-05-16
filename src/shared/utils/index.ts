/** 数字格式化：按中文 locale 添加千分位分隔 */
export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat('zh-CN').format(n)
}

/** 日期格式化，支持传入字符串或 Date 对象 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(date))
}
