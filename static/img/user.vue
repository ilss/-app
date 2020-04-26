<template>
  <view class="content">
    <view class="enter-module-list">
      <ty-cell-item
        title="手机号"
        :addon="user.userInfo.phone || '186******99'"
      ></ty-cell-item>
      <ty-cell-item
        title="姓名"
        arrow
        :addon="user.userInfo.name"
        @tap="editName"
      ></ty-cell-item>
    </view>

    <view class="enter-module-list">
      <ty-cell-item
        title="修改密码"
        arrow
        @tap="editPwd"
      ></ty-cell-item>
    </view>

    <view class="enter-module-list">
      <ty-cell-item
        title="关于"
        arrow
        :addon="appVersion"
        @tap="about"
      ></ty-cell-item>
    </view>
    <!-- <view class="enter-module-list">
      <ty-cell-item
        title="设置服务器地址"
        :addon="$api.baseUrl"
        arrow
      ></ty-cell-item>
      <ty-cell-item
        title="版本"
        addon="1.0.0"
        arrow
      ></ty-cell-item>
    </view> -->

    <view class="enter-module-list">
      <ty-cell-item
        :title="$t('my.exit')"
        style="text-align: center; color:red !important;"
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
    return {
      appVersion: ''
    }
  },
  components: { tyCellItem },
  computed: mapState(['hasLogin', 'user']),
  onLoad() {
    // #ifdef APP-PLUS
    this.appVersion = plus.runtime.version
    // #endif
  },
  methods: {
    ...mapMutations(['logout']),
    editPwd() {
      uni.navigateTo({
        url: 'editPwd'
      })
    },
    editName() {
      uni.navigateTo({
        url: 'editName'
      })
    },
    about() {
      uni.navigateTo({
        url: 'about'
      })
    }
  }
}
</script>

<style lang="scss">
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
