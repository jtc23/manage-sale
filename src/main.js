// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import VueCurrencyFilter from 'vue-currency-filter'
import VueParticles from 'vue-particles'
import VueLazyload from 'vue-lazyload'
import axios from 'axios'
import VueAxios from 'vue-axios'
import EUI from 'element-ui'
import App from './App'
import {router} from './router'
import store from './store'
import i18n from './lang'
import * as filters from './filters'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(EUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueCurrencyFilter,
  {
    symbol: '￥',
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: true
  })

const options = {
  color: 'rgb(143, 255, 199)',
  failedColor: '#ff0000',
  thickness: '2px',
  transition: {
    speed: '0.3s',
    opacity: '0.6s',
    termination: 500
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)
Vue.use(VueParticles)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/images/error.png',
  loading: '/static/images/loading-spin.svg',
  attempt: 1,
  listenEvents: ['scroll']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
})
