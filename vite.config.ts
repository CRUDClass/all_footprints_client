import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/bill': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        bypass: (req) => {
          // 浏览器导航请求带 text/html，跳过代理让 Vite 处理 SPA fallback
          // API 请求（fetch/upload）不走这里，正常代理到后端
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
            return req.url
          }
        },
      },
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
