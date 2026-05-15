import type { RouteRecordRaw } from 'vue-router'

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
        path: 'data-import',
        name: 'data-import',
        component: () => import('@/features/data-import/pages/DataImportPage.vue'),
      },
    ],
  },
]
