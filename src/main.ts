import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import { routes } from './router'
import './assets/css/main.css'

// 应用入口：注册 Pinia 状态管理、Vue Router 路由、Nuxt UI 插件
const app = createApp(App)

const pinia = createPinia()
const router = createRouter({
  routes,
  history: createWebHistory(),
})

app.use(pinia)
app.use(router)
app.use(ui)

app.mount('#app')
