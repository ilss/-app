/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 一些全局样式配置
 */
<script>
export default {
  onLaunch: function() {},
  onShow: function() {
    // console.log('App Show')
  },
  onHide: function() {
    // console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import './static/font/iconfont.css';
@import './common/uni.css';
@import './static/css/animate.css';
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
/*每个页面公共css */
.loading {
  background-color: rgba(255, 255, 255, 0.75);
}
page {
  width: 100vw;
  min-height: 100%;
  display: flex;
  color: $uni-text-color;
}

/* #ifdef MP-BAIDU */
page {
  width: 100%;
  height: 100%;
  display: block;
}

swan-template {
  width: 100%;
  min-height: 100%;
  display: flex;
}

/* 原生组件模式下需要注意组件外部样式 */
custom-component {
  width: 100%;
  min-height: 100%;
  display: flex;
}

/* #endif */

/* #ifdef MP-ALIPAY */
page {
  width: 100vw;
  min-height: 100vh;
}

/* #endif */

/* 原生组件模式下需要注意组件外部样式 */
m-input {
  width: 100%;
  min-height: 100%;
  display: flex;
}
.hidden{
  display: none;
}
.view-mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  // opacity:0 !important;
}
.content {
  background-color: $uni-bg-color-grey;
  width: 100%;
}

.input-group {
  background-color: #ffffff;
  margin-top: 40upx;
  position: relative;
}

.input-group::before {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  height: 1upx;
  content: '';
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-group::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1upx;
  content: '';
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-row {
  display: flex;
  flex-direction: row;
  position: relative;
}
.input-row .title {
  width: 25%;
  height: 50upx;
  min-height: 50upx;
  padding: 15upx 0;
  padding-left: 30upx;
  font-size: $uni-font-size-base;
  line-height: 50upx;
}

.input-row.border::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 15upx;
  height: 1upx;
  content: '';
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.btn-row {
  margin-top: 50upx;
  padding: 20upx;
}
.btn-primary {
  $lh: 60upx;
  margin-right: $ty-content-padding;
  background-color: $uni-color-warning;
  font-size: 16px;
  border-radius: 100px;
  width: 200upx;
  height: $lh;
  line-height: $lh;
  color: #fff;
  text-align: center;
}
.fixed {
  position: fixed;
}
button.primary {
  background-color: $uni-color-primary !important;
}
button.primary:hover {
  background-color: $uni-color-primary;
}
//导航栏全局样式
.nav-bar-btn {
  font-size: 56upx;
}
.no-data {
  background: url(static/img/no-data.png) no-repeat center center;
  background-size: 500upx;
  width: 100vw;
  height: 10vh;
  padding-top: 40vh;
  color: $uni-text-color-placeholder;
  text-align: center;
}
.data-error {
  text-align: center;
  .btn-primary {
    margin: auto;
    padding: 0 30upx;
  }
}

checkbox .uni-checkbox-input {
  border-radius: 12upx;
  margin-right: 20upx;
}
checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  color: #fff !important;
  background-color: $uni-color-primary;
}

radio .uni-radio-input {
  border-radius: 100upx;
  margin-right: 20upx;
}
radio .uni-radio-input.uni-radio-input-checked {
  color: #fff !important;
  background-color: $uni-color-primary !important;
  border-color: $uni-color-primary !important;
}
// radio .uni-radio-input.uni-radio-input-checked::before{
//   content: '\e441';
// }

.flex-row {
  display: flex;
  flex-direction: row;
}
.single-row-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
//隐藏滚动条
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.btn-login {
  background-image: -webkit-linear-gradient(0deg, #0B1D51, #127795);
  -webkit-animation: hue 10s infinite linear;
}
@keyframes hue {
  0% {
    -webkit-filter: hue-rotate(0deg);
  }
  50% {
    -webkit-filter: hue-rotate(90deg);
  }
  100% {
    -webkit-filter: hue-rotate(0deg);
  }
}
</style>
