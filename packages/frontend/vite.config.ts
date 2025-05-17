import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'url'
import { setupVitePlugins } from './build'

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, __dirname) as ImportMetaEnv
  const rootPath = fileURLToPath(new URL('./', import.meta.url))
  const srcPath = `${rootPath}src`
  return {
    resolve: {
      alias: {
        '@': srcPath,
      },
    },
    plugins: setupVitePlugins(viteEnv),
    server: {
      host: true,
      port: 5173,
      proxy: {
        [viteEnv.VITE_API_PREFIX]: {
          target: viteEnv.VITE_PROXY_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(viteEnv.VITE_API_PREFIX, ''),
        },
      },
    },
  }
})
