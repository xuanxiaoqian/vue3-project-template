import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Jsx from '@vitejs/plugin-vue-jsx'

import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), Jsx()],

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false, //自动打开浏览器
    https: false,
    base: './ ', //生产环境路径
    proxy: {
      '^/api': {
        target: 'http://localhost', // 后端服务实际地址
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  resolve: {
    alias: {
      '/@': resolve(__dirname, './src') //把src改为@
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "/@/style/variable.scss";`
      }
    }
  },

  // 生产环境去除 console debugger
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
