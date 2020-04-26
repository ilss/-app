<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 多试卷考试 切换试卷时临时跳转页面 手机端本页跳转有BUG
-->
<template>
  <view class="content">
    <!-- 下一场考试跳转过渡页面 -->
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  created() {
   uni.reLaunch({
     url: './trainingOrExam'
   })
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
</style>
