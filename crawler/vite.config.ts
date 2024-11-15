/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})