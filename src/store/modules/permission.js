import { constantRouterMap } from '@/config/router.config'
import { getUserRoleTree } from '@/api/resource'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(resources, route) {
    if (route.meta && route.meta.code) {
      const flag = resources.some(resource => { return route.meta.code === resource.code })
      return flag
    }
    return true
  }
  
  /**
   * 单账户多角色时，使用该方法可过滤角色不存在的菜单
   *
   * @param roles
   * @param route
   * @returns {*}
   */
  // eslint-disable-next-line
  function hasRole(roles, route) {
    if (route.meta && route.meta.roles) {
      return route.meta.roles.indexOf(roles.id)
    } else {
      return true
    }
  }
  
  function filterAsyncRouter(routerMap, roles) {
    const accessedRouters = routerMap.filter(route => {
      if (hasPermission(roles, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, roles)
        }
        return true
      }
      return false
    })
    return accessedRouters
  }


const state = {
    routers: constantRouterMap,
    addRouters: []
}

const mutations = {
    SET_ROUTERS: (state, data) => {
        state.addRouters = data
        state.routers = constantRouterMap.concat(data)
      }
}

const actions = {
    generateRoutes({ commit }, asyncRouterMap) {
        // return new Promise((resolve, reject) => {
        //   const { roles } = data
        //   console.log('-----mutations---data----', data)
        //   let accessedRouters
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        //   console.log('-----mutations---accessedRouters----', accessedRouters)
        //   commit('SET_ROUTERS', accessedRouters)
        //   resolve()
        // })
        return new Promise((resolve, reject) => {
          getUserRoleTree()
            .then((resp) => {
              if (resp.code === 200) {
                const { data } = resp
                let accessedRouters
                accessedRouters = filterAsyncRouter(asyncRouterMap, data)
                commit('SET_ROUTERS', accessedRouters)
                resolve(accessedRouters)
              }
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}