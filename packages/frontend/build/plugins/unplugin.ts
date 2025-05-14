import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

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
      // 加载自定义图标
      local: FileSystemIconLoader('packages/common/assets/icons'),
    },
  }),
]
