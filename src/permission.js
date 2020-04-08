import router from './router'
import store from './store'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { generateIndexRouter } from "@/utils"
NProgress.configure({ showSpinner: false })

const whiteList = ['login', 'register'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    NProgress.start()  //  start progress bar
    // set page title
    document.title = getPageTitle(to.meta.title)
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === 'user/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            const hasResources = store.getters.resources && store.getters.resources.length > 0
            if (hasResources) {
                next()
            } else {
                try {
                    const constRoutes = await store.dispatch('user/setResources')
                    const accessRoutes = await store.dispatch('permission/generateRoutes', constRoutes)
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                } catch (error) {
                    console.log(error)
                    // await store.dispatch('user/resetToken')
                    // next(`/user/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.includes(to.name)) {
            next()
        } else {
            next(`/user/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})