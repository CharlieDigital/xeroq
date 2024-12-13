import { defineConfig } from 'vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: { lib: { entry: resolve(__dirname, 'src/xeroq.ts'), formats: ['es'] }, sourcemap: true },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [dts(), nodePolyfills()],
})
