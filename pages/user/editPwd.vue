<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 修改密码页面
-->
<template>
  <view class="content">
    <!--    <ty-nav-bar
     backState="1000"
      type="fixed"
      title="修改密码"
    ><view slot="right" @tap="postEditPwd">保存</view>
    </ty-nav-bar> -->
    <view>
      <view class="input-row">
        <m-input
          type="text"
          :inputWidth="690"
          :maxlength="20"
          placeholder="原密码"
          v-model.trim="oldPwd"
        ></m-input>
      </view>
      <view class="input-row">
        <m-input
          type="text"
          :inputWidth="690"
          :maxlength="20"
          v-model.trim="newPwd"
          placeholder="新密码, 至少 6 个字符"
        ></m-input>
      </view>
      <view class="input-row">
        <m-input
          type="text"
          :inputWidth="690"
          :maxlength="20"
          v-model.trim="confimPwd"
          placeholder="再次输入新密码"
        ></m-input>
      </view>
    </view>
    <!--    <view class="btn-row">
      <button
        type="primary"
        class="primary"
        @tap="register"
      >
        提交
      </button>
    </view> -->
  </view>
</template>

<script>
// import { mapState, mapMutations } from 'vuex'
import mInput from '@/components/m-input.vue'
import { account } from '@/api/api.js'
export default {
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      confimPwd: '',
      showLoading: false
    }
  },
  components: { mInput },
  // computed: mapState(['hasLogin', 'user']),
  onNavigationBarButtonTap() {
    this.postEditPwd()
  },
  onBackPress(e) {
    // #ifdef APP-PLUS
    plus.key.hideSoftKeybord()
    // #endif
  },
  methods: {
    // ...mapMutations(['logout']),
    postEditPwd() {
      if (this.oldPwd.length < account.pwdMinLength) {
        uni.showToast({
          icon: 'none',
          title: `原密码最短为 ${account.pwdMinLength} 个字符`
        })
        return
      }

      if (this.newPwd.length < account.pwdMinLength) {
        uni.showToast({
          icon: 'none',
          title: `新密码最短为 ${account.pwdMinLength} 个字符`
        })
        return
      }

      if (this.newPwd === this.oldPwd) {
        uni.showToast({
          icon: 'none',
          title: '原密码不能用于新密码'
        })
        return
      }

      if (this.newPwd !== this.confimPwd) {
        uni.showToast({
          icon: 'none',
          title: '两次输入的 新密码 不一致'
        })
        return
      }

      let _data = {
        param: {
          token: this.$store.getters.getToken,
          oldPwd: this.oldPwd,
          newPwd: this.newPwd
        }
      }
      this.showLoading = true
      this.$tyDebounce({
        key: 'editPwdHandler',
        time: 3000,
        success: () => {
          uni.request({
            url: this.$api.baseUrl + this.$api.user.editPassword,
            data: this.$encryption(_data),
            method: 'POST',
            success: res => {
              let { data } = this.$decryption(res)
              if (toString.call(data) !== '[object Object]') {
                data = {
                  success: false,
                  msg: '服务器错误'
                }
              } else {
                if (!data.data.success) {
                  data = {
                    success: false,
                    msg: data.data.data.msg
                  }
                } else {
                  data = {
                    success: true,
                    msg: '修改成功'
                  }
                  this.oldPwd = ''
                  this.newPwd = ''
                  this.confimPwd = ''
                }
              }
              let t = setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: data.msg
                })
                clearTimeout(t)
                t = null
              }, 100)
            },
            fail: () => {
              let t = setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: '网络异常,请稍后重试'
                })
                clearTimeout(t)
                t = null
              }, 100)
            },
            complete: () => {
              _data = null
              this.showLoading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: $ty-margin-line;
}
.input-row {
  line-height: 100upx;
  height: 100upx;
  margin-bottom: 16upx;
  background-color: #fff;
  padding-left: 20upx;
}
.logout-btn {
  margin-top: 20upx;
  background-color: #fff;
  color: orangered;
  border-radius: 0px;
  border: none;
}
</style>
