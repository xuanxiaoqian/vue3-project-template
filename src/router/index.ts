import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('/@/views/Home/Home.vue'),
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

  next()
})

router.afterEach(() => {})

export default router
