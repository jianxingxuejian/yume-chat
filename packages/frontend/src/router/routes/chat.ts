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
    path: '/chat/:id?',
    name: 'chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: 'yume-chat',
    },
    props: true,
  },
]

export default routes
