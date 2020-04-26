<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 我的页面
-->
<template>
  <view class="content">
    <!--    <ty-nav-bar
      type="fixed"
      title="我的"
    ></ty-nav-bar> -->
    <view class="enter-module-list">
      <ty-cell-item
        title="手机号"
        v-once
        :addon="user.userInfo.phone"
      ></ty-cell-item>
      <ty-cell-item
        title="姓名"
        :addon="user.userInfo.name"
      ></ty-cell-item>
      <!-- <ty-cell-item
        title="姓名"
        arrow
        :addon="user.userInfo.name"
        @tap="editName"
      ></ty-cell-item> -->
    </view>

    <view class="enter-module-list" v-once>
      <ty-cell-item title="修改密码" arrow @tap="editPwd"></ty-cell-item>
    </view>
    <view class="enter-module-list">
      <!-- <ty-cell-item
        title="设置服务器地址"
        :addon="$api.baseUrl"
        arrow
      ></ty-cell-item> -->
      <ty-cell-item title="关于" v-once arrow @tap="about"></ty-cell-item>
    </view>

    <view class="enter-module-list" v-once>
      <ty-cell-item
        title="退出登录"
        style="text-align: center; color:#F74D2E !important;"
        @tap="logout"
      ></ty-cell-item>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import tyCellItem from '@/components/@tellyes-vue/ty-cell-item/ty-cell-item.vue'
export default {
  data() {
    return { canClick: true }
  },
  components: { tyCellItem },
  computed: mapState(['hasLogin', 'user']),
  onLoad() {
    // // #ifdef APP-PLUS
    // this.appVersion=plus.runtime.version
    // //#endif
  },
  methods: {
    ...mapMutations(['logout']),
    editPwd() {
      if (this.canClick) {
        this.resetClick()
        uni.navigateTo({
          url: 'editPwd'
        })
      }
    },
    editName() {
      if (this.canClick) {
        this.resetClick()
        uni.navigateTo({
          url: 'editName'
        })
      }
    },
    about() {
      if (this.canClick) {
        this.resetClick()
        uni.navigateTo({
          url: 'about'
        })
      }
    },
    resetClick() {
      this.canClick = false
      let t = setTimeout(() => {
        this.canClick = true
        clearTimeout(t)
        t = null
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin: 0;
  padding: 0;
}
.enter-module-list {
  background-color: #fff;
}

.enter-module-list {
  margin-top: 20upx;
}

.logout-btn {
  margin-top: 20upx;
  background-color: #fff;
  color: orangered;
  border-radius: 0px;
  border: none;
}
</style>
