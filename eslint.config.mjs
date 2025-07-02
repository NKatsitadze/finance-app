import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Enforce single quotes, except to avoid escaping
      quotes: ['error', 'single', { avoidEscape: true }],

      // Disallow semicolons
      semi: ['error', 'never'],

      // Optional: Remove unnecessary semicolons
      'no-extra-semi': 'error',
    },
  },
]

export default eslintConfig
