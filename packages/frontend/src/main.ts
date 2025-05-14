import { createApp } from 'vue'
import { setupStore } from './stores'
import { setupRouter } from './router'
import App from './App.vue'

import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
