import type { Router } from 'vue-router'
import { useTitle } from '@vueuse/core'

export function createRouterGuard(router: Router) {
  router.beforeEach((to, from) => {
    if (to.path != from.path) {
      window.$loadingBar?.start()
    }
  })
  router.afterEach((to, from) => {
    useTitle(to.meta.title || (to.matched[0]?.meta?.title as string))
    if (to.path != from.path) {
      window.$loadingBar?.finish()
    }
  })
}
