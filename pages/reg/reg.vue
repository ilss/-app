<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 注册通用账号页面
-->
<template>
  <view class="content">
    <view>
      <view class="input-row">
        <view style="flex: 1;">
          <m-input
            type="number"
            v-model.trim="phone"
            placeholder="请输入手机号码"
          ></m-input>
        </view>
        <!-- <view class="get-code">
          <ty-captcha
            ref="captcha"
            title="获取验证码"
            waitTitle="重新获取(SECORD)"
            normalClass="captcha-normal"
            disabledClass="captcha-disabled"
            @click="getCaptcha"
          ></ty-captcha>
        </view> -->
      </view>
      <!-- <view class="input-row">
        <m-input
          type="number"
          v-model.trim="captcha"
          :inputWidth="690"
          :maxlength="20"
          placeholder="请输入短信验证码"
        ></m-input>
      </view> -->
      <view class="input-row">
        <m-input
          type="text"
          v-model.trim="name"
          :inputWidth="690"
          :maxlength="20"
          placeholder="请输入姓名, 2-20个汉字或字母"
        ></m-input>
      </view>
      <view class="input-row">
        <m-input
          type="text"
          v-model.trim="password"
          :inputWidth="690"
          :maxlength="20"
          placeholder="请输入密码, 至少 6 个字符"
        ></m-input>
      </view>
      <view class="input-row">
        <m-input
          type="text"
          v-model.trim="rePassword"
          :inputWidth="690"
          :maxlength="20"
          placeholder="请再次输入密码"
        ></m-input>
      </view>
    </view>
    <button type="primary" class="primary btn-login" @tap="register">
      注 册
    </button>
  </view>
</template>

<script>
import mInput from '@/components/m-input.vue'
// import tyCaptcha from '@/components/@tellyes-vue/ty-captcha/ty-captcha.vue'
import { regUid, regPhone, regName } from '@/util/utils.js'
import { account } from '@/api/api.js'
// 一些验证配置
const nameReg = new RegExp('^[\\u4e00-\u9fa5A-z\\s]{2,20}$', 'g')
export default {
  components: {
    mInput
    // tyCaptcha
  },
  data() {
    return {
      phone: '',
      // captcha: '',
      name: '',
      password: '',
      rePassword: ''
    }
  },
  onBackPress(e) {
    // #ifdef APP-PLUS
    plus.key.hideSoftKeybord()
    // #endif
  },
  methods: {
    // getCaptcha() {
    //   if (regPhone(this.phone)) {
    //     uni.showToast({
    //       icon: 'none',
    //       title: '请输入正确的 手机号'
    //     })
    //     return
    //   }
    //   if (this.$refs.captcha.canSend()) this.$refs.captcha.begin()
    // },
    initData() {
      this.phone = ''
      this.name = ''
      this.password = ''
      this.rePassword = ''
    },
    register() {
      if (regPhone(this.phone)) {
        uni.showToast({
          icon: 'none',
          title: '请输入正确的 手机号'
        })
        return
      }

      // if (this.captcha.length < 3) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '请输入 短信验证码'
      //   })
      //   return
      // }

      this.name = this.name.trim()
      const _len = this.name.length
      if (
        _len < account.nameMinLength ||
        _len > account.nameMaxLength ||
        !/^[\u4e00-\u9fa5A-z\s]+$/g.test(this.name)
      ) {
        uni.showToast({
          icon: 'none',
          title: '请输入正确的 姓名'
        })
        return
      }

      if (this.password.length < account.pwdMinLength) {
        uni.showToast({
          icon: 'none',
          title: `密码最短为 ${account.pwdMinLength} 个字符`
        })
        return
      }

      if (this.password !== this.rePassword) {
        uni.showToast({
          icon: 'none',
          title: '两次输入的 密码 不一致'
        })
        return
      }

      const data = {
        phone: this.phone,
        // captcha: this.captcha,
        name: this.name,
        password: this.password
      }
      uni.showLoading()
      uni.request({
        url: this.$api.baseUrl + this.$api.user.register,
        data: {
          param: data
        },
        method: 'POST',
        success: res => {
          let data = res.data,
            msg = null
          if (toString.call(data) !== '[object Object]') {
            msg = '服务器错误'
          } else {
            if (data.data.success) {
              msg = '注册成功'
            } else {
              msg = data.data.data.msg
            }
          }
          let t = setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: msg
            })
            clearTimeout(t)
          }, 100)
        },
        fail: () => {
          let t = setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '网络异常,请稍后重试'
            })
            clearTimeout(t)
          }, 100)
        },
        complete: () => {
          uni.hideLoading()
        }
      })

      // uni.showToast({
      //   title: '注册成功'
      // })
      // uni.navigateBack({
      //   delta: 1
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
$inputWidth: 568upx;
$inputHeight: 86upx;
.content {
  padding-top: $ty-margin-line;
}
.input-row {
  line-height: 100upx;
  height: 100upx;
  background-color: #fff;
  border-top: 1px solid $uni-border-color;
  padding-left: 20upx;
  display: flex;
  align-items: center;
}
.primary {
  width: $inputWidth;
  height: $inputHeight;
  line-height: $inputHeight;
  font-size: 32upx;
  border-radius: 80px;
  margin: 64upx auto 0 auto;
}
.get-code {
  width: 280upx;
  color: $uni-color-warning;
  text-align: center;
}
.captcha-disabled {
  color: #999;
}
</style>
