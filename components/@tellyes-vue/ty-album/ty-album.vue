<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 图片放大预览组件
-->
<template>
  <view>
    <view class="controllers">
      <view class="btn" @tap="changeSwiper('left')" v-show="swiperCurrent > 0">
        上一个
      </view>
      <view
        class="btn"
        @tap="changeSwiper('right')"
        v-show="swiperCurrent < imageArray.length - 1"
      >
        下一个
      </view>
    </view>
    <swiper class="swiper" :autoplay="false" :current="swiperCurrent">
      <swiper-item
        @touchmove.stop
        v-for="(val, index) in imageArray"
        :key="index"
      >
        <movable-area :scale-area="true">
          <movable-view direction="all" scale="true">
            <image :src="val" @error="imageError"></image>
          </movable-view>
        </movable-area>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
let swiperOnChange = false
export default {
  props: {
    imageArray: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      swiperCurrent: 0
    }
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: '1/' + this.imageArray.length
    })
  },
  methods: {
    changeSwiper(direction) {
      direction === 'right'
        ? (this.swiperCurrent += 1)
        : (this.swiperCurrent -= 1)
      if (this.swiperCurrent < 0) {
        this.swiperCurrent = 0
      } else if (this.swiperCurrent > 2) {
        this.swiperCurrent = 2
      }
      uni.setNavigationBarTitle({
        title: this.swiperCurrent + 1 + '/' + this.imageArray.length
      })
    },
    imageError(e) {
      uni.showToast({
        icon: 'none',
        title: '找不到此图片'
      })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.swiper {
  width: 100vw;
  height: 100vh;
}
movable-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
.controllers {
  position: fixed;
  bottom: 30upx;
  left: 0;
  width: 100vw;
  text-align: center;
  color: #fff;
  z-index: 99999;
  .btn {
    display: inline-block;
    margin: 0 40upx;
    padding: 0upx 50upx;
    background-color: rgba(30, 30, 30, 0.5);
    border-radius: 100px;
    font-size: $uni-font-size-base;
  }
}
movable-area {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  left: 0;
}

movable-view image {
  width: 100vw;
}
</style>
