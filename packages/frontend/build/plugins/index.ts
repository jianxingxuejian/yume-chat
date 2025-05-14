import type { PluginOption } from 'vite'
import html from './html'
import unocss from './unocss'
import unplugin from './unplugin'
import vue from './vue'

export function setupVitePlugins(env: ImportMetaEnv): PluginOption[] {
  const plugins = [html(env), unocss, ...unplugin, vue]
  return plugins
}
