// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Vue from '@vitejs/plugin-vue'


// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      Vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: true,
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
  }
})
