import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['**/node_modules', '**/dist', '**/output', 'eslint.config.mjs'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  eslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      'no-restricted-globals': ['error', { name: '__dirname' }, { name: '__filename' }],
    },
  },
)
