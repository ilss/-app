<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 练习&考试 页面底栏通用组件
-->
<template>
  <view class="panel-view">
    <view class="uni-flex" style="flex-direction: column; flex: 1;">
      <view class="uni-flex">
        <view class="panel-answer-num" v-if="showPanelNum">
          <view
            v-if="showAnswerNum"
            style="color: #FFF; font-size: 24upx; line-height: 12px;"
          >
            剩余次数: {{ answerNum }}
          </view>

          <view
            style="width: 200upx; margin: 10upx 30upx 0 0; padding: 0; height: 6px; overflow: hidden;"
            v-if="showProgress"
          >
            <view class="progress-box">
              <progress
                :percent="progress"
                activeColor="#34C79E"
                stroke-width="3"
              />
            </view>
          </view>

          <view style="color: #FFF; font-size: 28upx; line-height: 28upx;">
            <view class="m-right" v-if="showDiagnosticLabel">
              已添加
              <strong>{{ diagnosticLabel }}</strong>
              项
            </view>

            <view
              class="exam-time"
              v-if="this.$store.state.targetExamId"
              :style="examTimeStyle"
            >
              倒计时: {{ this.$root.examTimeCountdown }}
            </view>
          </view>
        </view>
        <view
          v-if="showPopBtn"
          style="color:#fff;flex: 1;"
          :style="showPopBtnStyle"
          @tap="clickHandler()"
          v-once
        >
          查看记录
        </view>
      </view>
    </view>
    <view
      class="btn-primary"
      v-once
      style="color:#FFF; width: 160upx; font-size: 28upx;"
      @tap="endScene()"
    >
      提交本站
    </view>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
// import tyCountdown from '@/components/@tellyes-vue/ty-countDown/ty-countdown.vue'
export default {
  // components: { tyCountdown },
  props: {
    showAnswerNum: {
      // 问诊量是否显示
      type: Boolean,
      default: true
    },
    showDiagnosticLabel: {
      // 诊断模块 个数 是否显示
      type: Boolean,
      default: false
    },
    diagnosticLabel: {
      // 诊断模块 显示个数
      type: Number,
      default: 0
    },
    answerNum: {
      // 问诊量上限
      type: Number,
      default: 0
    },
    maxAnswerNum: {
      // 问诊量上限
      type: Number,
      default: 100
    },
    showProgress: {
      // 百分比是否显示
      type: Boolean,
      default: true
    },
    progress: {
      // 百分比
      type: Number,
      default: 100
    },
    showPanelNum: {
      // 计数模块是否显示
      type: Boolean,
      default: true
    },
    showPopBtn: {
      // 记录按钮是否显示
      type: Boolean,
      default: true
    },
    showPopBtnStyle: {
      // 记录按钮自定义样式
      type: String,
      default: ''
    },
    examTimeStyle: {
      // 倒计时自定义样式
      type: String,
      default: ''
    }
  },
  data() {
    return {
      examTimeSecond: 10
    }
  },
  computed: {
    // ...mapState(['serverTime'])
  },
  created() {},
  methods: {
    clickHandler() {
      this.$emit('handler')
    },
    endScene() {
      this.$root.endScene()
    },
    gameOver() {
      this.$root.endScene(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-view {
  position: fixed;
  width: 100vw;
  bottom: 0;
  height: 120upx;
  padding: 20upx 0;
  background-color: rgba(1, 10, 34, 0.85);
  corlor: #fff;
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  .panel-answer-num {
    // flex: 1;
    margin-left: $ty-content-padding;
  }
  .m-right {
    padding-right: $ty-content-padding;
  }
}

.exam-time {
  color: #ffaa00;
  padding-right: 50upx;
}
strong {
  margin: 0 10upx;
}
</style>
