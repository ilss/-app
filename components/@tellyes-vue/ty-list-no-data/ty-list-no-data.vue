<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局无数据组件
-->
<template>
  <view class="no-data" v-if="canShow">{{ text }}</view>
</template>

<script>
export default {
  props: {
    canShow: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.no-data {
  background: url(../../../static/img/no-data.png) no-repeat center center;
  background-size: 500upx;
  width: 100vw;
  height: 10vh;
  padding-top: 40vh;
  color: $uni-text-color-placeholder;
  text-align: center;
}
</style>
