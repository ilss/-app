<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局Loading动画组件
-->
<template>
  <view class="ty-data-loading animated fadeIn" :class="myClass" v-once>
    <view class="loader-inner ball-spin-fade-loader" :style="myStyle">
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
      <view class="div"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ty-data-loading',
  props: {
    myStyle: {
      type: String,
      default: ''
    },
    myClass: {
      type: String,
      default: ''
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.ty-data-loading {
  position: fixed;
  z-index: 9999999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: colum;
  justify-content: center;
  align-items: center;
}
.loader-inner > .div:nth-child(odd) {
  background-color: $uni-color-primary !important;
}
.loader-inner > .div:nth-child(even) {
  background-color: $uni-color-warning !important;
}
@-webkit-keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.ball-spin-fade-loader {
  position: relative;
  margin-left: -30upx;
}
.ball-spin-fade-loader > view:nth-child(1) {
  top: 25px;
  left: 0;
  -webkit-animation: ball-spin-fade-loader 1s -0.96s infinite linear;
  animation: ball-spin-fade-loader 1s -0.96s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(2) {
  top: 17.04545px;
  left: 17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s -0.84s infinite linear;
  animation: ball-spin-fade-loader 1s -0.84s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(3) {
  top: 0;
  left: 25px;
  -webkit-animation: ball-spin-fade-loader 1s -0.72s infinite linear;
  animation: ball-spin-fade-loader 1s -0.72s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(4) {
  top: -17.04545px;
  left: 17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s -0.6s infinite linear;
  animation: ball-spin-fade-loader 1s -0.6s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(5) {
  top: -25px;
  left: 0;
  -webkit-animation: ball-spin-fade-loader 1s -0.48s infinite linear;
  animation: ball-spin-fade-loader 1s -0.48s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(6) {
  top: -17.04545px;
  left: -17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s -0.36s infinite linear;
  animation: ball-spin-fade-loader 1s -0.36s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(7) {
  top: 0;
  left: -25px;
  -webkit-animation: ball-spin-fade-loader 1s -0.24s infinite linear;
  animation: ball-spin-fade-loader 1s -0.24s infinite linear;
}
.ball-spin-fade-loader > view:nth-child(8) {
  top: 17.04545px;
  left: -17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s -0.12s infinite linear;
  animation: ball-spin-fade-loader 1s -0.12s infinite linear;
}
.ball-spin-fade-loader > view {
  background-color: #fff;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
}
</style>
