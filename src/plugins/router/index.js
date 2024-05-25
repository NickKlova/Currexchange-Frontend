import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import AuthService from '@/js/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = AuthService.getCurrentUser()
  const role = AuthService.getRole()

  if (requiresAuth && !user) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(role)) {
    next('/')
  } else {
    next()
  }
})

export default function (app) {
  app.use(router)
}
export { router }
