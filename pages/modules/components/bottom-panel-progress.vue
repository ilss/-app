<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 进度条组件
-->
<template>
  <view :style="'width:' + barWidth + 'upx'">
    <view class="uni-flex">
      <view class="uni-flex-item">{{ labelText }}:</view>
      <view class="">{{ currentNum }}/{{ maxNum }}</view>
    </view>

    <view :style="'width:' + barWidth + 'upx'">
      <view>
        <progress
          :percent="progress(currentNum, maxNum)"
          activeColor="#34C79E"
          stroke-width="5"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    barWidth: {
      // 当前数量
      type: String,
      default: '250'
    },
    labelText: {
      type: String,
      default: ''
    },
    currentNum: {
      // 当前数量
      type: Number,
      default: 0
    },
    maxNum: {
      // 数量上限
      type: Number,
      default: 100
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    progress(numerator, denominator) {
      if (parseInt(numerator) === 0) return 0
      const _res = parseInt(numerator) / parseInt(denominator)*100
      return _res
    },
    clickHandler() {
      this.$emit('handler')
    },
    endScene() {
      // this.$root.endScene()
    }
  }
}
</script>

<style lang="scss" scoped>
strong {
  margin: 0 10upx;
}
</style>
