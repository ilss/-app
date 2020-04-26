<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 登录页面
-->
<template>
  <view class="login">
    <ty-data-loading v-if="showLoading" class="loading"></ty-data-loading>
    <view class="view-mask" v-show="showMask"></view>
    <view class="cover" :class="showLogo ? 'animated fadeInDown' : 'hidden'">
      <image src="../../static/img/login/logo@3x.png" class="logo" />
    </view>
    <view class="content">
      <view :class="showEnter ? 'animated bounceInUp' : 'hidden'">
        <view class="app-name" v-once>{{ this.$api.options.appName }}</view>
        <view class="app-name-en" v-once>Clinical Decision Making System</view>
        <view class="group">
          <!-- <text class="title" v-once>通用账号</text> -->
          <m-input
            class="m-input"
            iconClass="iconiconzh1"
            :iconSize="20"
            type="text"
            clearable
            v-model="account"
            placeholder="通用账号"
          />
        </view>

        <view class="group">
          <!-- <text class="title" v-once>密&nbsp;&nbsp;码</text> -->
          <m-input
            type="password"
            iconClass="iconmima"
            :iconSize="18"
            class="m-input"
            displayable
            v-model="password"
          />
        </view>

        <button
          type="primary"
          class="primary btn-login"
          @tap="bindLogin"
          v-once
        >
          登 录
        </button>

        <view class="action-row" v-once>
          <navigator class="navigator" url="../reg/reg">
            注册天堰通用账号
            <span class="iconfont iconweizhankai"></span>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import service from '../../service.js'
import mInput from '@/components/m-input.vue'
// import crypto from '../../../node_modules/crypto-js/crypto-js.js'
export default {
  components: {
    mInput
  },
  data() {
    return {
      account: '',
      password: '123456',
      // positionTop: 0,
      showLoading: false,
      showMask: true,
      showLogo: false,
      showEnter: false
    }
  },
  onLoad() {
    //#ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    //#endif
  },
  mounted() {
    try {
      this.account = uni.getStorageSync(this.$api.storage.userData)
    } catch (e) {
      console.log(e)
    }
    let t1 = setTimeout(() => {
        this.showLogo = true
        clearTimeout(t1)
        t1 = null
      }, 200),
      t2 = setTimeout(() => {
        this.showEnter = true
        clearTimeout(t2)
        t2 = null
      }, 800),
      t3 = setTimeout(() => {
        this.showMask = false
        clearTimeout(t3)
        t3 = null
      }, 1200)
    // this.$isLogin('login')
    // this.getModulesByParams()
    // this.initPosition()
  },
  methods: {
    async getModulesByParams() {
      //重整 练习类别 数组
      let _array = this.$api.caseClass.category,
        _arrayTemp = [],
        _param = this.$store.getters.userParam,
        _data = await this.$fetch.post(
          this.$api.baseUrl + this.$api.user.enterModules,
          {
            param: {
              user_select_caseCategoryKey: this.$api.options.categoryKey,
              user_id: _param.user_id,
              user_baseRoleId: _param.user_baseRoleId,
              user_orgid: _param.user_orgid,
              user_adv_type: _param.user_adv_type,
              user_type: 'Student'
            }
          }
        )

      // _data = _data || []
      _data.map(b => {
        const _index = _array.findIndex(a => a.id === b.id)
        if (_index > -1) {
          _arrayTemp.push(_array[_index])
        }
      })
      
      if (_arrayTemp.length > 0) {
        this.$store.commit('setCaseCategory', _arrayTemp)
      }

      setTimeout(() => {
        _param = null
        _array = null
        _arrayTemp = null
        uni.reLaunch({
          url: '../main/main'
        })
      }, 333)
    },
    // initPosition() {
    //   /**
    //    * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
    //    * 反向使用 top 进行定位，可以避免此问题。
    //    */
    //   this.positionTop = uni.getSystemInfoSync().windowHeight - 100
    //   uni.pageScrollTo({
    //     scrollTop: 300,
    //     duration: 400
    //   })
    // },
    bindLogin() {
      let _store = this.$store
      const _api = this.$api
      if (this.account.length < 5) {
        uni.showToast({
          icon: 'none',
          title: '账号最短为 5 个字符'
        })
        return
      }

      if (this.password.length < _api.account.pwdMinLength) {
        uni.showToast({
          icon: 'none',
          title: `密码最短为 ${_api.account.pwdMinLength} 个字符`
        })
        return
      }
      // uni.showLoading({
      // 	title: this.$t('login.inTheLogin'),
      // 	mask: true
      // })
      
      let _param = {
        param: {
          name: this.account,
          pwd: this.password
        }
      }

      _param = this.$encryption(_param)

        this.$tyDebounce({
          key: 'starLoginHandler',
          time: 3000,
          success: () => {
            this.showLoading = true
            
            uni.request({
              url: _api.baseUrl + _api.user.login,
              data: _param,
              method: 'POST',
              success: res => {
                let _data = this.$decryption(res.data)
                if (toString.call(_data) !== '[object Object]') {
                  _data = {
                    success: false,
                    msg: '通用用户服务异常,请稍后重试'
                  }
                }
                if (!_data.success) {
                  this.showLoading = false
                  let t = setTimeout(() => {
                    uni.showToast({
                      icon: 'none',
                      title: _data.msg
                    })
                    clearTimeout(t)
                    t = null
                  }, 100)
                  return
                }
                if (!_data.data.success) {
                  this.showLoading = false
                  let t = setTimeout(() => {
                    uni.showToast({
                      icon: 'none',
                      title: _data.data.msg
                    })
                    clearTimeout(t)
                    t = null
                  }, 100)
                  return
                }
                const userParam = _data.data.data.user_param
                if (userParam.user_type !== 'Student') {
                  this.showLoading = false
                  let t = setTimeout(() => {
                    uni.showToast({
                      icon: 'none',
                      title: '请使用-学生账号-登录'
                    })
                    clearTimeout(t)
                    t = null
                  }, 100)
                  return
                }
                _store.commit('login')
                _store.commit('updateUserInfo', _data.data.data)
                _store.dispatch('getUserOnlineStatus')
                this.getModulesByParams()
                uni.setStorageSync(this.$api.storage.userData, this.account)
                // uni.showToast({
                //   icon: 'none',
                //   title: '登录成功'
                // })
              },
              fail: () => {
                this.showLoading = false
                let t = setTimeout(() => {
                  uni.showToast({
                    icon: 'none',
                    title: '通用用户服务异常,请稍后重试'
                  })
                  clearTimeout(t)
                  t = null
                }, 100)
              },
              complete: () => {
                // uni.hideLoading()
                // this.showLoading = false
              }
            })
          }
        })
    }
  },
  beforeDestroy() {
    this.account = null
    this.password = null
    // this.positionTop = null
    this.showLoading = null
    this.showLogo = null
    this.showEnter = null
    this.showMask = null
  }
}
</script>

<style lang="scss" scoped>
@import '@/static/css/login.scss';
</style>
