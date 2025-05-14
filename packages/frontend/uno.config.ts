import { defineConfig, presetWind4, transformerVariantGroup, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  transformers: [transformerVariantGroup()],
  content: {
    pipeline: {
      include: ['**/*.vue'],
      exclude: ['node_modules', '.git', 'dist'],
    },
  },
  shortcuts: {
    'flex-col': 'flex flex-col',
    'flex-row': 'flex flex-row',
    'flex-center': 'flex justify-center items-center',
    'flex-start': 'flex justify-start items-center',
    'flex-end': 'flex justify-end items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-evenly': 'flex justify-evenly items-center',
    'flex-around': 'flex justify-around items-center',
    'flex-wrap': 'flex flex-wrap',
  },
})
