import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { Message } from 'element-ui'

import Index from '@/containers/Index'
import Projects from '@/containers/Projects'
import Questionaire from '@/containers/Questionaire'
import Auth from '@/containers/Auth'
import User from '@/containers/Users'
import store from '@/store'

const localStorage = require('store')

Vue.use(Router)

const rules = {
  loginRequired() {
    if (store.getters.isLogedIn) {
      return true
    }
    const user = localStorage.get('user') || {}
    if (user.isLogedIn) {
      return true
    }
    return 'You must login for access this page!'
  },
  uuidRequired() {
    return true
  },
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: 'Quantified UX Metric',
      },
    },
    {
      path: '/projects',
      component: Projects.Base,
      children: [
        {
          path: '',
          name: 'ProjectsList',
          component: Projects.List,
          meta: {
            title: 'Projects List',
            rules: [
              'loginRequired',
            ],
          },
        },
        {
          path: ':id/details',
          name: 'Project Detail',
          component: Projects.Detail,
          meta: {
            title: 'Project Details',
            rules: [
              'loginRequired',
            ],
          },
        },
      ],
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth.Base,
      children: [
        {
          path: 'register',
          name: 'Register',
          component: Auth.Register,
        },
        {
          path: 'login',
          name: 'Log in',
          component: Auth.Login,
        },
        {
          path: 'logout',
          name: 'Logout',
          component: Auth.Logout,
        },
      ],
    },
    {
      path: '/questionaire',
      name: 'Questionaire',
      component: Questionaire.Questionaire,
      meta: {
        title: 'User Study Questionaire',
      },
    },
    {
      path: '/user/profile',
      name: 'User Profile',
      component: User.Profile,
      meta: {
        title: 'User Profile',
        rules: [
          'loginRequired',
        ],
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.rules) return next()

  const middlewares = to.meta.rules.map(item => rules[item])

  for (let i = 0; i < middlewares.length; i += 1) {
    const result = middlewares[i](to)

    if (result !== true) {
      Message({ type: 'error', message: result || 'System Error' })

      return next('/')
    }
  }

  return next()
})

router.afterEach((to) => {
  nprogress.done()
  document.title = to.meta.title || 'Quantified UX Metric'
})

export default router
