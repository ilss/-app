<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 考务信息页面
-->
<template>
  <view class="content">
    <ty-data-loading v-if="showLoading" class="loading"></ty-data-loading>
    <view class="exam-cont">
      <view class="exam-info" v-once>
        <view class="name">{{ examInfo.name || '--' }}</view>
        <view>开始考试时间：{{ examInfo.start_time || '--' }}</view>
        <view>结束考试时间：{{ examInfo.end_time || '--' }}</view>
        <view>
          允许入场时间：
          <span v-if="examInfo.duration < 0">
            开考后 {{ examInfo.enter_time }} 分钟
          </span>
          <span v-else>随到随考</span>
        </view>
        <view v-if="examInfo.allowCommitTime > -1">
          最早交卷时间：开考后 {{ examInfo.allowCommitTime }} 分钟
        </view>
        <view style="color: #fa0;" v-if="examInfo.cases">
          * 本考试共包含 {{ examInfo.cases.length || 1 }} 站
        </view>
      </view>

      <view class="exam-notice" v-once>
        <view class="title">注意事项</view>
        <view class="txt">{{ examInfo.attentionItem || '-- 暂无' }}</view>
      </view>

      <view class="controllers">
        <view class="start-dis" v-if="examEnd">考试已结束</view>
        <view class="start-dis" v-if="!canStart && !examEnd">
          {{ hintMsg }}
          <ty-countdown
            background-color="transparent"
            border-color="transparent"
            :show-day="false"
            :second="second"
            :reset="false"
            @timeup="timeUp"
          ></ty-countdown>
        </view>
        <view
          class="start"
          v-if="!examEnd && canStart"
          @tap.stop="startExamHandler"
        >
          开始考试
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tyCountdown from '@/components/@tellyes-vue/ty-countdown/ty-countdown.vue'
let targetExamAllowCommitTime = null
export default {
  data() {
    return {
      showLoading: true,
      examInfo: null,
      second: 10000,
      examEnd: false,
      canStart: false,
      hintMsg: '距开考'
    }
  },
  components: { tyCountdown },
  watch: {},
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.examInfo = { ...this.$store.getters.getTargetExamInfo }
      const _GMTToStr = this.$options.filters['GMTToStr']
      this.second =
        this.timeBetweenSecond(_GMTToStr(this.examInfo.start_time)) + 4
      const _timeout = -this.second / 60
      this.examInfo.start_time = _GMTToStr(this.examInfo.start_time).split(
        ' '
      )[1]
      this.examInfo.end_time = _GMTToStr(this.examInfo.end_time).split(' ')[1]
      this.showLoading = false
      //超过允许入场时间 活着 超过 考试时长
      if (_timeout > this.examInfo.enter_time) {
        this.examEnd = true
      }
      //考试已开始
      this.canStart = this.second < 0 ? true : false
    },
    timeUp(val) {
      this.canStart = true
    },
    timeBetweenSecond(time) {
      return Math.floor((Date.parse(time) - Date.now()) / 1000)
    },
    startExamHandler() {
      this.showLoading = true
      const examId = this.examInfo.exam_id,
        { userParam } = this.$store.getters,
        { baseUrl } = this.$api

      this.$fetch
        .post(baseUrl + this.$api.exams.entryQuiz, {
          param: {
            examId: examId,
            attendanceId: userParam.user_id
          }
        })
        .then(_data => {
          if (!_data.success) {
            let t = setTimeout(() => {
              this.showLoading = false
              uni.showModal({
                content: _data.msg,
                showCancel: false
              })
              clearTimeout(t)
              t = null
            }, 1000)

            return
          }

          // 保存开考时间信息
          const _timeData = _data.data[_data.data.length - 1]
          this.$store.commit('saveStartExamData', _timeData)

          this.$fetch
            .post(baseUrl + this.$api.exams.start, {
              param: {
                examId: examId,
                user_id: userParam.user_id,
                user_select_caseCategoryKey:
                  userParam.user_select_caseCategoryKey
              }
            })
            .then(_data => {
              if (!_data.flg) {
                let t = setTimeout(() => {
                  this.showLoading = false
                  uni.showModal({
                    content: _data.msg,
                    showCancel: false
                  })
                  clearTimeout(t)
                  t = null
                }, 1000)
              } else {
                this.$store.commit('saveTargetExamId', examId)
                this.$store.commit('saveStartExamData', _data)
                this.$store.commit('saveTargetExamFirstTime', _data.startTime)
                uni.reLaunch({
                  url: '../trainingOrExam/trainingOrExam'
                })
              }
            })
        })
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.examInfo = null
    this.second = null
    this.examEnd = null
    this.canStart = null
    targetExamAllowCommitTime = null
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: $uni-color-primary;
  color: rgba(239, 243, 255, 0.8);
}
.exam-cont {
  display: flex;
  flex-direction: column;
  height: 97vh;
  //#ifdef H5
  height: 90vh;
  //#endif
  .controllers {
    padding: 0 $ty-content-padding $ty-content-padding;
    height: 100upx;
  }
  .start,
  .start-dis {
    background-color: $uni-color-warning;
    font-size: $uni-font-size-lg;
    line-height: 86upx;
    height: 86upx;
    border-radius: 100upx;
    font-weight: bold;
    text-align: center;
    margin: 30upx 0;
  }
  .start-dis {
    background-color: $uni-text-color-sub;
  }
}
.exam-info {
  padding: $ty-content-padding;
  // height: 260upx;
  .name {
    font-size: 40upx;
    font-weight: bold;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.exam-notice {
  background-color: #fff;
  color: #343639;
  flex: 1;
  border-radius: 20upx;
  margin: 0 $ty-content-padding $ty-content-padding;
  padding: $ty-content-padding;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .txt {
    overflow-y: scroll;
    overflow-x: hidden;
    flex: 1;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-base + 2 !important;
  }
  .title {
    font-size: $uni-font-size-lg;
    color: $uni-color-primary;
    font-weight: bold;
    height: 80upx;
    line-height: 80upx;
  }
}
</style>
