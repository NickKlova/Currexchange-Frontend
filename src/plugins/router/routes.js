export const routes = [
  { path: '/', redirect: '/transaction/create' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'transaction/create',
        component: () => import('@/pages/Transactions/CreateTransaction.vue'),
      },
      {
        path: 'currencies/get',
        component: () => import('@/pages/Currencies/GetCurrencies.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
