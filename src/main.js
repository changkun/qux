import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui'

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import 'element-ui/lib/theme-default/index.css'
import './styles/index.scss'

import Components from './components'
import store from './store'
import router from './router'
import App from './App'

sync(store, router)

Vue.config.productionTip = false

locale.use(lang)
Vue.use(ElementUI)
Vue.use(Components)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
