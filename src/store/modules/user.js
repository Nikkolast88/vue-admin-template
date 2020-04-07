import { getResources } from '@/api/resource'
const state = {
  token: '',
  resources: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  RESET_TOKEN: (state) => {
      state.token = ''
  },
  SET_RESOURCES: (state, resource) => {
    state.resources = resource
  }
}

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  resetToken({ commit }) {
      commit('RESET_TOKEN')
  },
  setResources({ commit }) {
    return new Promise((resolve, reject) => {
      getResources()
        .then((resp) => {
          if (resp.code === 200) {
            const { data } = resp
            commit('SET_RESOURCES', data)
            resolve(data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
