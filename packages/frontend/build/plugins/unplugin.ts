import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

export default [
  AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: '../common/types/auto-import.d.ts',
    include: [/\.vue$/, /\.vue\?vue/, /\.ts$/],
    eslintrc: {
      enabled: true,
      // filepath: '../../eslintrc-auto-import.json',
    },
  }),
  Icons({
    autoInstall: true,
    compiler: 'vue3',
    scale: 1,
    defaultStyle: 'display: inline-block',
    customCollections: {
      // load custom icons
      local: FileSystemIconLoader('packages/common/assets/icons'),
    },
  }),
  Components({
    dirs: ['src/components'],
    deep: true,
    directives: true,
    dts: 'src/types/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: [/[\\/]node_modules[\\/]/],
    resolvers: [
      NaiveUiResolver(),
      IconsResolver({
        customCollections: ['custom'],
        prefix: 'icon',
      }),
    ],
  }),
]
