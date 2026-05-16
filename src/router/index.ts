import type { RouteRecordRaw } from 'vue-router'

// 路由配置：DefaultLayout 作为父布局包裹所有子页面
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/features/dashboard/pages/DashboardPage.vue'),
      },
      {
        path: 'bill/wechat',
        name: 'bill-wechat',
        component: () => import('@/features/data-import/pages/WeChatPage.vue'),
      },
      {
        path: 'bill/alipay',
        name: 'bill-alipay',
        component: () => import('@/features/data-import/pages/AlipayPage.vue'),
      },
    ],
  },
]
