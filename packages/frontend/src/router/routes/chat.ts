const routes: Route.Config[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: 'yume-chat',
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: 'yume-chat',
    },
  },
]

export default routes
