# Vue3 + Vite2 + TypeScript面向企业级别开发项目环境



## 介绍

本项目将帮助你搭建vue3面向企业级项目开发环境，用于提升前端开发速度及效率。





## 技术栈

| 名字           | 说明                         |
| -------------- | ---------------------------- |
| Vue3           | 构建用户界面的渐进式框架     |
| Tsx Typescript | JavaScript类型提示、语法扩展 |
| Prettierrc     | 格式化代码                   |
| Vite2          | 前端开发与构建工具           |
| Scss           | css扩展框架                  |
| Vue-router4    | 路由                         |
| Axios          | HTTP请求                     |
| Pinia          | 全局状态管理                 |





## 步骤

###  1. 安装vite脚手架环境

~~~sh
npm init vite@latest
~~~





### 2. 安装Jsx插件

~~~sh
npm i @vitejs/plugin-vue-jsx --dev
~~~





### 3. 安装prettierrc并配置

~~~sh
npm i eslint-config-prettier --dev
~~~



.prettierrc文件添加

~~~json
{
    "useTabs": false,
    "tabWidth": 2,
    "printWidth": 100,
    "singleQuote": true,
    "trailingComma": "none",
    "bracketSpacing": true,
    "semi": false
}
~~~





### 4. Vite别名与跨域反向代理

vite.config.ts文件

~~~ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Jsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'	// 如果报错则安装一下 npm i @types/node	vscode报错需要关闭软件重启

export default defineConfig({
    plugins: [vue(), Jsx()],

    server: {
        open: false, //自动打开浏览器
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
            '/@': resolve(__dirname, './src') // 例： /@/components/HelloWorld.vue
        }
    }
})

~~~



tsconfig.json文件

~~~json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "baseUrl": ".",	// 配置一
    "paths": {	// 配置二
      "/@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

~~~







### 5. Vite全局变量

跟项目下新建`.env.development`文件和`.env.production`文件

~~~js
# .env.development

NODE_ENV = development

VITE_APP_BASEURL = ''

VITE_APP_BASE_API = /api



# .env.production

NODE_ENV = production

VITE_APP_BASEURL = ''

VITE_APP_BASE_API = www.xuanxiaoqian.com

// 使用 import.meta.env.VITE_APP_BASE_API
~~~



Ts联想提示，在`src`文件下新增`dev.d.ts`文件(如有则修改就行)

~~~ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // 更多环境变量...
  readonly VITE_APP_BASE_API : string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
~~~





配置 `package.json` , 打包区分开发环境和生产环境

~~~sh
"build:dev": "vite build --mode development",
"build:pro": "vite build --mode production",
~~~



### 6. css预处理器scss

~~~sh
npm i dart-sass --dev

npm i sass --dev
~~~





### 7. Vue-router路由

~~~sh
npm i vue-router@4
~~~



`src`文件下新增`router`文件夹和`views`文件夹

~~~ts
// router/index.ts

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('/@/views/Home/Home.vue'),	// 需要创建这个文件，不然启动会报错
        meta: {
        title: '404not found'
    }
    },
    {
    path: '/',
    name: 'Home',
    component: () => import('/@/views/Home/Home.vue')
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    strict: true,

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// 路由白名单
const whiteList = ['/', '/index', '/home', '/login', '/register']

router.beforeEach((to, from, next) => {
    // if (whiteList.indexOf(to.path) === -1) {   // 如果有需要就打开
    //   next({ path: '/' })
    // } else {
    //   next()
    // }
})

router.afterEach(() => {})

export default router

~~~



修改入口文件`main.ts`

~~~ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

const app = createApp(App)

app.use(router)

app.mount('#app')
~~~



修改主页面`App.vue`

~~~vue
<script setup lang="ts">

</script>

<template>
    <router-view></router-view>
</template>

<style>
</style>

~~~









### 8. axios数据请求

~~~sh
npm i axios
~~~



`src`文件下新增`utils`文件夹并在下面再建一个`http`文件夹	src/utils/http

~~~js
// src/utils/http/defaultConfig.ts

import axios, { AxiosRequestConfig } from "axios";

export const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 1000,
};

export default defaultConfig;

~~~



~~~ts
// src/utils/http/interceptors.ts

import Axios, { AxiosInstance } from 'axios'

import defaultConfig from './defaultConfig'

export class Interceptors {
    public instance: AxiosInstance

    constructor() {
        this.instance = Axios.create(defaultConfig)

        this.init()
    }

    init() {
        // 数据请求之前
        this.instance.interceptors.request.use(
            (config: any) => {
                const token = window.sessionStorage.getItem('token')
                if (token) {
                    config.headers.token = token
                }

                // console.log("请求了");
                return config
            },
            (err) => {
                console.log(err)
            }
        )

        // 数据返回之前
        this.instance.interceptors.response.use(
            (response) => {
                // console.log("响应了");
                return Promise.resolve(response)
            },
            (err) => {
                console.log(err)
            }
        )
    }

    getInterceptors() {
        return this.instance
    }
}
const instance = new Interceptors().getInterceptors()

export default instance
~~~



~~~ts
// src/utils/http/index.ts

import { AxiosInstance } from 'axios'

import instance from './interceptors'

const http: AxiosInstance = instance

export default http
~~~





`src`文件下新增`api`文件夹并在下面再建一个`login`文件夹	src/api/login

~~~ts
// 	src/api/login/types.ts

export interface LoginParams {
    userName: string
    passWord: string | number
}
export interface LoginApi {
    login: (params: LoginParams) => Promise<any>
}
~~~



~~~ts
// 	src/api/login/login.ts

import http from '/@/utils/http'
import * as T from './types'

const loginApi: T.LoginApi = {
  login(params) {
    return http.post('/login', params)
  }
}
export default loginApi
~~~



使用

~~~ts
import loginApi from '/@/api/login/login';

loginApi.login({userName:'root',passWord:'123456'}).then(res=>{
    console.log(res.data);
})
~~~







### 9. pinia状态管理

~~~sh
npm i pinia@next
~~~



`src`文件下新增`store`文件夹

~~~ts
// src/store/main.ts

import { defineStore } from 'pinia'

export const useMainStore = defineStore({
    id: 'mian',
    state: () =>({
        name: '超级管理员'
    })
})
~~~





修改入口文件`main.ts`

~~~TS
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')

~~~



使用

~~~vue
<script setup lang="ts">
import { useMainStore } from '/@/store/main';

const mainStore = useMainStore()
</script>

<template>
    <div>{{ mainStore.name }}</div>
</template>

<style>
</style>
~~~





### 10. reset.css样式统一化

`src`文件下新增`style`文件夹

~~~css
// src/style/reset.css


/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
~~~





修改入口文件`main.ts`

~~~ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// reset.css
import './style/reset.css'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
~~~





### 11. hooks代码复用

`src`文件下新增`hooks`文件夹

~~~ts
// src/hooks/usePoint.ts

import {reactive, onMounted, onBeforeUnmount} from 'vue'
export  default function () {
    //展示的数据  可以通过App.vue 界面去隐藏
    let point = reactive({
        x: 0,
        y: 0
    })

    //获取鼠标点击事件
    function savePonint(event: MouseEvent) {
        point.x = event.pageX
        point.y = event.pageY
        console.log(event.pageX, event.pageY)
    }

    //现实之后调用 挂载完毕
    onMounted(() => {
        window.addEventListener('click', savePonint)
    })

    //在隐藏之前调用 卸载之前
    onBeforeUnmount(() => {
        window.removeEventListener('click', savePonint)
    })

    return point
}
~~~



使用

~~~ts
import usePoint from '/@/hooks/usePoint'

let point = usePoint()
console.log(point);
~~~







## X. TODO

`以下的内容均不在仓库中，只是为了方便有需要的人能快速使用`





### Element-Plus 组件库

> https://element-plus.gitee.io/zh-CN/guide/installation.html

~~~sh
npm install element-plus --save
~~~



修改入口文件`main.ts`

~~~TS
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
~~~



使用

~~~vue
<el-row class="mb-4">
    <el-button type="primary">看见我没问题就成功了!!!</el-button>
</el-row>
~~~





### VueUse hooks库

> https://vueuse.org/





### Nprogress 网站进度条

> https://ricostacruz.com/nprogress/

~~~sh
npm install --save nprogress
~~~



~~~ts
import Nprogress from 'nprogress';
import "nprogress/nprogress.css";

Nprogress.configure({
    // 动画方式
    easing: "ease",
    // 递增进度条的速度
    speed: 500,
    // 是否显示加载ico
    showSpinner: false,
    // 自动递增间隔
    trickleSpeed: 200,
    // 初始化时的最小百分比
    minimum: 0.3
});

export default Nprogress;
~~~



使用

~~~ts
import NProgress from '../utils/nprogress'

NProgress.start()	// 控制开始加载

NProgress.done()	// 控制结束加载
~~~





### JsCookie 本地cookie

> https://www.npmjs.com/package/js-cookie

~~~sh
npm install js-cookie --save
~~~



使用

~~~ts
import Cookies from 'js-cookie'

// Create a cookie, valid across the entire site:
Cookies.set('name', 'value');
 
// 创建一个从现在起7天内过期的cookie，在整个站点有效:
Cookies.set('name', 'value', { expires: 7 });
 
// Create an expiring cookie, valid to the path of the current page:
Cookies.set('name', 'value', { expires: 7, path: '' });
 
//           name       value
Cookies.set('TokenKey', token, { expires: 1000, path: '/', domain: 'xx.com' });
 
 
//不写过期时间，默认为1天过期
this.$cookies.set("user_session","25j_7Sl6xDq2Kc3ym0fmrSSk2xV2XkUkX")
 
this.$cookies.set("token","GH1.1.1689020474.1484362313","60s");  // 60秒后过去
 
this.$cookies.set("token","GH1.1.1689020474.1484362313","30MIN");  // 30分钟后过去


// Read cookie:
Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined
 
// Read all visible cookies:
Cookies.get(); // => { name: 'value' }

// Delete cookie:
Cookies.remove('name');
 
// Delete a cookie valid to the path of the current page:
Cookies.set('name', 'value', { path: '' });
Cookies.remove('name'); // fail!
Cookies.remove('name', { path: '' }); // removed!

~~~

