<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局通知栏组件
-->
<template>
  <view
    class="app-toast fade-in"
    v-if="isShow"
    :class="{
      info: type === 'info',
      success: type === 'success',
      wraning: type === 'warn',
      danger: type === 'danger'
    }"
  >
    <view class="pic">
      <span class="icon" v-if="type === 'info'">
        &#xe61e;
      </span>
      <span class="icon" v-else-if="type === 'success'">
        &#xe742;
      </span>
      <span class="icon" v-else-if="type === 'warn'">
        &#xe61e;
      </span>
      <span class="icon" v-else="type === 'danger'">
        &#xe657;
      </span>
    </view>
    <view>{{ text }}</view>
  </view>
</template>
<style lang="scss" scoped>
@font-face {
  font-family: 'tynoticefont';
  src: url('../font/iconfont.eot');
  src: url('../font/iconfont.eot?#iefix')
      format('embedded-opentype'),
    url('../font/iconfont.woff2') format('woff2'),
    url('../font/iconfont.woff') format('woff'),
    url('../font/iconfont.ttf') format('truetype'),
    url('../font/iconfont.svg#iconfont') format('svg');
}
@keyframes fade-in {
  from {
    opacity: 0;
    -webkit-transform: translate(-50%, -100px);
    transform: stranslate(-50%, -100px);
  }
  to {
    opacity: 1;
    -webkit-transform: translate(-50%, 0);
    transform: stranslate(-50%, 0);
  }
}

@-webkit-keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate(-50%, -100px);
    transform: stranslate(-50%, -100px);
  }
  to {
    opacity: 1;
    -webkit-transform: translate(-50%, 0);
    transform: stranslate(-50%, 0);
  }
}

@keyframes fadeInTop {
  from {
    opacity: 1;
    -webkit-transform: translate(-50%, 0);
    transform: stranslate(-50%, 0);
  }
  to {
    opacity: 0;
    -webkit-transform: translate(-50%, -100px);
    transform: stranslate(-50%, -100px);
  }
}

.fade-in {
  animation: fadeInDown 1s both;
  -webkit-animation: fadeInDown 1s both;
}

.fade-out {
  animation: fadeInTop 1s forwards;
  -webkit-animation: fadeInTop 1s forwards;
}

.app-toast {
  position: fixed;
  display: flex;
  flex-direction: row;
  left: 50%;
  top: 20upx;
  background: #ccc;
  padding: 10px;
  border-radius: 5px;
  transform: translate(-50%, 0%);
  z-index: 998;
  .pic {
    display: flex;
    text-align: center;
    justify-content: center;
    margin: 2px 5px auto 0;
    .icon {
      font-family: 'tynoticefont' !important;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}
.info {
  background: #eef2fd;
  color: #007aff;
}
.success {
  background: #f0f9eb;
  color: #07c160;
}
.wraning {
  background: #fdf6ec;
  color: #ff9900;
}
.danger {
  background: #fef0f0;
  color: #ff0000;
}
</style>
