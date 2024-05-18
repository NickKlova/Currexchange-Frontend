export const routes = [
  { path: '/', redirect: '/base' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '/base',
        component: () => import('@/pages/main.vue'),
      },
      {
        path: 'transaction/create',
        component: () => import('@/pages/transactions/CreateTransaction.vue'),
      },
      {
        path: 'currencies/get',
        component: () => import('@/pages/currencies/Currencies.vue'),
      },
      {
        path: 'rate/create',
        component: () => import('@/pages/rates/CreateRate.vue'),
      },
      {
        path: 'rates/get',
        component: () => import('@/pages/rates/ViewRates.vue'),
      },
      {
        path: 'funds/get',
        component: () => import('@/pages/funds/ViewFunds.vue'),
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
