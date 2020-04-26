/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 */
import Vue from 'vue'
import App from './App'
import * as api from './api/api.js'
import store from './store'
// import VueI18n from 'vue-i18n'
import * as filters from './util/filters'
import fetch from './util/fetch.js'
import {
  decryption,
  encryption
} from "./util/utils.js"
import tyNavBar from "@/components/@tellyes-vue/ty-navBar/index.vue"
import popupLayer from '@/components/popup-layer/popup-layer.vue'
import tyDataLoading from '@/components/@tellyes-vue/ty-data-loading/ty-data-loading.vue'
import tyListNoData from '@/components/@tellyes-vue/ty-list-no-data/ty-list-no-data.vue'
import tyDebounce from '@/util/debounce.js'

Vue.component("ty-nav-bar", tyNavBar)
Vue.component("popup-layer", popupLayer)
Vue.component("ty-data-loading", tyDataLoading)
Vue.component("ty-list-no-data", tyListNoData)
// import tyNotice from './components/@tellyes-vue/ty-notice/index'
// import lang from 'lang/zh-CN.js'
Vue.config.productionTip = false
// Vue.use(tyNotice)

// 静态国际化配置，只打包配置的单个语言文件
// Vue.use(VueI18n)
// Vue.prototype.$lang = lang
// APP端没有 window,document对象
Vue.prototype.$examTimeInterval = null
Vue.prototype.$fetch = fetch
Vue.prototype.$tyDebounce = tyDebounce

//静态国际化
// const lang = api.options.lang
// let langObj = require(`./lang/${lang}.js`).lang
// Vue.prototype.$t = (name) => {
//   let deep_value = function(obj, path) {
//     if (!path) {
//       return ''
//     }
//     for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
//       obj = obj[path[i]]
//     };
//     return obj
//   };
//   return deep_value(langObj, name)
// }

// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$examTimeInterval = null

/**
 * 登录状态验证
 * @param {String} inLogin  是否身在登录页
 */
// Vue.prototype.$isLogin = function(inLogin) {
//   let userData = ''
//   try {
//     userData = uni.getStorageSync(api.storage.userData)
//   } catch (e) {
//     console.log(e)
//   }
//   if (this.$store.getters.isHeartbeat) {
//     return false
//   }

//   uni.showLoading({
//     title: this.$t('login.autoLogin'),
//     mask: true
//   })
//   if (userData === '') {
//     // uni.showToast({
//     //   icon: 'none',
//     //   title: langObj.login.loginStateFailure
//     // })
//     this.$store.commit('clearUserData', inLogin)
//     uni.hideLoading()
//   } else {
//     const _this = this
//     if (!this.$store.getters.isLgoin) {
//       this.$store.commit('updateUserInfo', userData)
//       this.$store.dispatch('userOnlineStatus', inLogin)
//     } else {
//       _this.$store.dispatch('getUserOnlineStatus')
//       uni.hideLoading()
//       if (inLogin === 'login') {
//         uni.reLaunch({
//           url: '../main/main'
//         })
//       }
//     }
//   }
// }

Vue.prototype.$encryption = encryption

Vue.prototype.$decryption = decryption

App.mpType = 'app'

const app = new Vue({
  // i18n,
  store,
  ...App
})
app.$mount()
