import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import { routes } from './router'
import './assets/css/main.css'

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
