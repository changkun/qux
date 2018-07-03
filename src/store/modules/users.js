import assign from 'lodash/assign'
import * as user from '@/services/users'

const state = {
  oAuth: {
    isLogedIn: false,
    id: '',
    projects: [],
  },
  id: [],
  data: {},
  questionaire: false,
}

const getters = {
  isLogedIn: state => state.oAuth.isLogedIn,
  currentUser: state => state.data[state.oAuth.id] || {},
  questionaire: state => state.questionaire,
}
/* eslint-disable */
const mutations = {
  /**
   * mark as login if loged in
   * @param {Object} payload login payload
   */
  login(state, payload) {
    payload.password = null
    if (!state.data[payload._id]) {
      state.id.push(payload._id)
      state.data[payload._id] = {}
    }
    state.oAuth.isLogedIn = true
    state.oAuth.id = payload._id
    state.oAuth.projects = payload.projects

    assign(state.data[payload._id], payload)
  },
  /**
   * mark as loged out if logout
   */
  logout(state) {
    assign(state.oAuth, {
      isLogedIn: false,
      id: '',
      projects: [],
    })
  },

  destroy(state) {
    assign(state.oAuth, {
      isLogedIn: false,
      id: '',
      projects: [],
    })
  },

  /**
   * 将用户信息更新至 store
   * @param {Object} payload 需要更新的用户信息
   */
  updateUserInfo(state, payload) {
    state.data[payload._id] = assign({}, state.data[payload._id], payload)
  },
}

const actions = {
  /**
   * Login
   * @param {String} context
   * @param {Object} payload
   */
  login(context, payload) {
    context.commit('showLoading')
    return user.login(payload)
      .then((response) => {
        if (response.success === true) {
          context.commit('login', response.user)
        }
        context.commit('hideLoading')
        return Promise.resolve(response)
      })
      .catch(err => Promise.reject(err))
  },
  /**
   * Register
   * @param {String} context
   * @param {Object} payload
   */
  register(context, payload) {
    context.commit('showLoading')
    return user.register(payload)
      .then((response) => {
        if (response.success === true) {
          context.commit('login', response.user)
        }
        context.commit('hideLoading')
        return Promise.resolve(response)
      }).catch((err) => {
        context.commit('hideLoading')
        return Promise.reject(err)
      })
  },
  edit(context, payload) {
    context.commit('showLoading')
    return user.edit(payload)
      .then((response) => {
        if (response.success === true) {
          context.commit('login', response.user)
        }
        context.commit('hideLoading')
        return Promise.resolve(response)
      }).catch((err) => {
        context.commit('hideLoading')
        return Promise.reject(err)
      })
  },
  /**
   * Logout
   * @return {Promise}
   */
  logout(context) {
    context.commit('showLoading')
    return user.logout().then(() => {
      context.commit('logout')
      context.commit('hideLoading')
    })
  },

  destroy(context, payload) {
    context.commit('showLoading')
    return user.destroy(payload).then((response) => {
      context.commit('destroy')
      context.commit('hideLoading')
      return Promise.resolve(response)
    })
  }

}

export default {
  state,
  getters,
  mutations,
  actions,
}
