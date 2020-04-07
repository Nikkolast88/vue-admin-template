import { UserLayout } from '@/components/Layouts'

/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'dashboard',
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: []
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
      path: '/user',
      component: UserLayout,
      redirect: '/user/login',
      hidden: true,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
        }
      ]
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
    },
  
  ]