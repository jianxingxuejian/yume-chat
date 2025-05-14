import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import routes from './routes'
import { createRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env['VITE_BASE_URL']),
  routes: routes as RouteRecordRaw[],
})

export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}

export default router
