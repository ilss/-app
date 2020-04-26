<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 配置服务器地址
-->
<template>
  <view class="content">
    <!--    <ty-nav-bar
      type="fixed"
      title="修改密码"
    ><view slot="right" @tap="miss">跳过</view>
    </ty-nav-bar> -->
    <view class="group">
      <text class="title">{{ $t('enter.label') }}</text>
      <m-input
        class="m-input"
        type="text"
        clearable
        v-model="ip"
        :placeholder="$t('enter.placeholder')"
      />
      <button type="primary" class="primary" @tap="bindHostUrl">
        {{ $t('enter.button') }}
      </button>
    </view>
  </view>
</template>

<script>
import mInput from '@/components/m-input.vue'
export default {
  components: {
    mInput
  },
  data() {
    return {
      ip: ''
    }
  },
  onLoad() {
    const _this = this
    uni.getStorage({
      key: this.$api.storage.hostIpKey,
      success: function(res) {
        _this.ip = res.data
      }
    })
  },
  onNavigationBarButtonTap() {
    this.miss()
  },
  methods: {
    miss() {
      uni.reLaunch({
        url: '../login/login'
      })
    },
    bindHostUrl() {
      uni.setStorage({
        key: this.$api.storage.hostIpKey,
        data: this.ip
      })
      this.$api.baseUrl = `http://${this.ip}/`
      uni.reLaunch({
        url: '../login/login'
      })
    }
  },
  beforeDestroy() {
    this.ip = null
  }
}
</script>

<style lang="scss" scoped>
$inputWidth: 568upx;
$inputPadding: 24upx;
$inputHeight: 86upx;
$fontColor: #343639;
.page {
  text-align: center;
  width: 100vw;
}
.group {
  width: $inputWidth;
  margin: 30% auto auto;
  text-align: left;
}
.m-input {
  width: $inputWidth;
  height: $inputHeight;
  border: 1px solid #e6e6e6;
  border-radius: 8upx;
  margin: 0 0 20upx 0;
  text-align: left;
}
</style>
