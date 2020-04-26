<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 修改姓名页面
-->
<template>
  <view class="content">
    <!--    <ty-nav-bar
     backState="1000"
      type="fixed"
      title="修改姓名"
    ><view slot="right" @tap="postEditName">保存</view>
    </ty-nav-bar> -->
    <view>
      <view class="input-row">
        <m-input
          type="text"
          :inputWidth="690"
          :maxlength="8"
          placeholder="新姓名, 2-20个汉字或字母"
          v-model.trim="name"
        ></m-input>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import mInput from '@/components/m-input.vue'
import { account } from '@/api/api.js'
export default {
  data() {
    return {
      name: ''
    }
  },
  components: { mInput },
  computed: mapState(['hasLogin']),
  onNavigationBarButtonTap() {
    this.postEditName()
  },
  onBackPress(e) {
    // #ifdef APP-PLUS
    plus.key.hideSoftKeybord()
    // #endif
  },
  methods: {
    postEditName() {
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

      const data = {
        user_id: this.$store.getters.userId,
        name: this.name
      }
      uni.showLoading()
      uni.request({
        url: this.$api.baseUrl + this.$api.user.editName,
        data: {
          param: data
        },
        method: 'POST',
        success: res => {
          let { data } = res
          if (toString.call(data) !== '[object Object]') {
            data = {
              success: false,
              msg: '服务器错误'
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
          uni.hideLoading()
        }
      })
    }
  }
}
</script>

<style lang="scss">
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
