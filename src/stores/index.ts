import { defineStore } from 'pinia'
import { ref } from 'vue'

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
