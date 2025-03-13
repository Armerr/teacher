import { A_TOKEN } from '@common/constant';
import storage from '@common/storage';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import { asyncRoutes } from '@common/router/asyncModules';

const dev = process.env.NODE_ENV === 'development';

const NotFound = '/404';
const page404 = [
  {
    path: NotFound,
    name: 'NotFound',
    component: () => import('@views/app/page404.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@views/app/page404.vue'),
  },
];

const defaultRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('@views/app/login.vue'),
  },
  {
    path: '/main',
    name: 'appMain',
    meta: {
      title: '主页',
    },
    component: () => import('@views/app/main.vue'),
    children: [...asyncRoutes, ...page404],
  },
];

const routerInstance = createRouter({
  // 开发环境使用 WebHistory，浏览器地址栏可以看到页面路径和参数
  // 生产环境使用 MemoryHistory，看不到页面路径和参数
  history: dev ? createWebHistory() : createMemoryHistory(),
  routes: defaultRoutes,
});

routerInstance.beforeEach(async (to, _from, next) => {
  document.title = to.meta.title ?? '包老师助学系统';
  const token = storage.get(A_TOKEN);
  if (token) {
    if (to.path === '/') {
      next('/main');
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({ path: '/login' });
    }
  }
});
export default routerInstance;
