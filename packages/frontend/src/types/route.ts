import type { Component, FunctionalComponent, VNodeChild } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

declare global {
  namespace Route {
    interface Base {
      name: string
      path: string
      redirect?: string
      component?: Component
      props?: boolean | ((to: RouteLocationNormalized) => Record<string, any>)
    }

    interface Config extends Base {
      meta: Meta & {
        icon?: string | FunctionalComponent
      }
      children?: Optional<Config, 'meta'>[]
    }

    type Module = Record<string, { default: Config | Config[] | undefined }>

    interface RecordRaw extends Base {
      meta?: Meta & {
        icon?: () => VNodeChild
      }
      children?: RecordRaw[]
    }

    interface Meta {
      title: string
    }
  }
}
