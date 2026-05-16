import { defineStore } from 'pinia'
import { ref } from 'vue'

// 全局应用状态：管理当前页面标题，供布局或面包屑使用
export const useAppStore = defineStore('app', () => {
  const pageTitle = ref('首页')

  function setPageTitle(title: string) {
    pageTitle.value = title
  }

  return {
    pageTitle,
    setPageTitle,
  }
})
