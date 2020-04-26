<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 练习&考试页面
-->
<template>
  <view class="content">
    <!-- 倒计时 -->
    <ty-data-loading v-if="showLoading" class="loading"></ty-data-loading>
    <!-- <view v-if="examId && examId.length > 1">
      倒计时: {{ countdown | formatTime }}
    </view> -->
    <view class="tab-bar-view">
      <ty-tabs-scroll
        ref="tabs"
        activeColor="#F74D2E"
        :tabData="tabs"
        :defaultIndex="swiperCurrent"
        @tabClick="swiperChange"
      />
    </view>
    <swiper
      style="height: 100vh;"
      duration="300"
      previous-margin="0"
      next-margin="0"
      :skip-hidden-item-layout="true"
      :current="swiperCurrent"
    >
      <swiper-item @touchmove.stop>
        <view class="module-view"><patient-data /></view>
      </swiper-item>

      <swiper-item
        v-if="
          methondId === ModuleTypeClass.caseCollectionStation.id ||
            methondId === ModuleTypeClass.inquiry.id
        "
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 病史采集 -->
          <history-taking :studentAnswerData="answerData.inquiryAnswers" />
        </view>
      </swiper-item>

      <swiper-item
        v-if="
          methondId === ModuleTypeClass.physicalCheck.id ||
            methondId === ModuleTypeClass.caseCollectionStation.id
        "
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 体格检查 -->
          <physical
            :studentAnswerData="answerData.physicalCheckAnswers"
            :studentAnswerExplainData="answerData.physicalCheckExplainAnswers"
          />
        </view>
      </swiper-item>

      <swiper-item
        v-if="methondId === ModuleTypeClass.assistantStation.id"
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 辅助检查 -->
          <medical-check
            :studentAnswerData="{
              medicalCheckAnswers: answerData.medicalCheckAnswers,
              medicalCheckExplainAnswers: answerData.medicalCheckExplainAnswers
            }"
          />
        </view>
      </swiper-item>

      <swiper-item
        v-if="
          methondId === ModuleTypeClass.caseAnalysisStation.id ||
            methondId === ModuleTypeClass.caseCollectionStation.id
        "
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 诊断 case-collection-->
          <case-collection :studentAnswerData="answerData.diagnoses" />
        </view>
      </swiper-item>

      <swiper-item
        v-if="
          methondId === ModuleTypeClass.caseAnalysisStation.id ||
            methondId === ModuleTypeClass.caseCollectionStation.id
        "
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 诊断依据 -->
          <diagnostic-basis :studentAnswerData="answerData.diagnoses" />
        </view>
      </swiper-item>

      <swiper-item
        v-if="methondId === ModuleTypeClass.caseAnalysisStation.id"
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 进一步检查 -->
          <auxiliary-examination :answerData="answerData.medicalCheckAnswers" />
        </view>
      </swiper-item>

      <swiper-item
        v-if="methondId === ModuleTypeClass.caseAnalysisStation.id"
        @touchmove.stop
      >
        <view class="module-view">
          <!-- 治疗原则 -->
          <treatment
            :studentAnswerData="
              answerData.studentTreatmentAnswer.treatmentPrincipleItemAnswers
            "
          />
        </view>
      </swiper-item>
    </swiper>

    <!--  <view class="tab-bar-view">
      <ty-tabs :list="tabBars" v-model="activeTabs" />
    </view> -->

    <!-- <popup-layer ref="popupRef" :direction="'top'">
      <view class="zidingyiBox">
        <m-icon
          color="#CCCCCC"
          type="iconclose btn-close"
          size="30"
          @tap="closeVideo"
        ></m-icon>
        <video
          v-if="showVideo"
          style="width: 750upx; height: 570upx;"
          direction="0"
          controls="false"
          src="http://114.116.110.224:3005/producerResource/ff/ff0416ecdd17a96c4e67f6e45e067499.mp4"
        ></video>
      </view>
    </popup-layer> -->
    <!-- <view class="bottom-bar">
      <button type="primary" @tap="endScene()">
        完成此病例
      </button>
    </view> -->
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import { ModuleTypeClass } from '../../api/api.js'
import {
  uniSegmentedControl,
  uniCollapse,
  uniCollapseItem
} from '@dcloudio/uni-ui'
import mIcon from '@/components/m-icon/m-icon.vue'
import patientData from '@/pages/modules/patientData.vue'
import physical from '@/pages/modules/physical.vue'
import medicalCheck from '@/pages/modules/medicalCheck.vue'
import historyTaking from '@/pages/modules/historyTaking.vue'
import caseCollection from '@/pages/modules/caseCollection.vue'
import treatment from '@/pages/modules/treatment.vue'
import auxiliaryExamination from '@/pages/modules/auxiliaryExamination.vue'
import diagnosticBasis from '@/pages/modules/diagnosticBasis.vue'
import tyTabsScroll from '@/components/@tellyes-vue/ty-tabs-scroll/ty-tabs.vue'

let saveAnswerUrl,
  quizId,
  userId,
  caseId,
  targetExamAllowCommitTime,
  targetExamInfo,
  _GMTToStr,
  seconds,
  [day, hour, minute, second] = [0, 0, 0, 0],
  getters,
  baseUrl,
  targetExamId,
  isPractise,
  startTime,
  count = 0
export default {
  components: {
    uniSegmentedControl,
    uniCollapse,
    uniCollapseItem,
    mIcon,
    tyTabsScroll,
    patientData,
    historyTaking,
    physical,
    caseCollection,
    treatment,
    diagnosticBasis,
    auxiliaryExamination,
    medicalCheck
  },
  data() {
    return {
      showLoading: false,
      tabs: ['患者信息'],
      swiperCurrent: 0,
      methondId: null,
      // examId: null,
      answerData: {
        studentTreatmentAnswer: { treatmentPrincipleItemAnswers: [] }
      },
      examEndTimeSecond: 0,
      examTimeCountdown: '00:00:00', //考试倒计时
      examData: {},
      caseData: [],
      ModuleTypeClass: Object.freeze(ModuleTypeClass)
    }
  },
  computed: {
    // ...mapState(['caseListData', 'serverTime'])
  },
  watch: {
    // serverTime: 'updateCountdown',
    // caseListData: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal);
    //   },
    //   deep: true
    // }
  },
  created() {
    _GMTToStr = this.$options.filters['GMTToStr']
    getters = this.$store.getters
    baseUrl = this.$api.baseUrl
    targetExamId = getters.getTargetExamId
    isPractise = targetExamId ? false : true
    // WEB端刷新 跳转
    // if (!getters.getTargetCaseId) {
    //   uni.reLaunch({
    //     url: '../main/main'
    //   })
    //   return
    // }

    // this.examId = getters.getTargetExamId
    this.initData()
    if (targetExamId) {
      this.examData = Object.freeze(
        getters.myExamsData.find(item => {
          return item._id === targetExamId
        })
      )
    }
    // this.tabs.push(caseClass.category[1].title)
    //初始化时间
    this.$store.commit('updateServerTime', new Date().toISOString())
  },
  // onNavigationBarButtonTap() {
  //   this.endScene()
  // },
  mounted() {
    if (this.$store.state.targetExamId) {
      targetExamInfo = this.$store.state.targetExamInfo
      this.initExamTime()
    }
  },
  /**
   * 禁止随意后退    $store 中的practiceCanBack控制
   */
  onBackPress(e) {
    let t = setTimeout(() => {
      this.$store.commit('practiceCanBack', false)
      clearTimeout(t)
      t = null
    }, 1000)
    if (!getters.getPracticeCanBack) {
      this.endScene()
      return true
    }
  },
  methods: {
    initData() {
      saveAnswerUrl = baseUrl + this.$api.training.saveAnswer
      caseId = getters.getTargetCaseId
      quizId = getters.getQuizId
      userId = getters.userParam.user_id
      let t1 = setTimeout(() => {
          this.getCaseInfo()
          clearTimeout(t1)
          t1 = null
        }, 10),
        t2 = setTimeout(() => {
          this.getAnswer()
          clearTimeout(t2)
          t2 = null
        }, 140)

      // this.getAnswer()
    },
    initExamTime() {
      if (targetExamInfo.duration < 0) {
        // 统一开考， 以考试结束时间为倒计时总时长
        this.examEndTimeSecond = this.timeBetweenSecond(
          _GMTToStr(this.$store.state.targetExamInfo.end_time)
        )
      } else {
        //随到随考，已试卷 duration 为倒计时总时长
        // console.log(targetExamInfo.first_time)
        if (!targetExamInfo.first_time) {
          this.examEndTimeSecond = targetExamInfo.duration * 60
        } else {
          this.examEndTimeSecond =
            targetExamInfo.duration * 60 +
            this.timeBetweenSecond(_GMTToStr(targetExamInfo.first_time))
        }
      }
      startTime = new Date().getTime()
      this.examTimeCountdownFunc()
      //初始化最早交卷时间
      targetExamAllowCommitTime = targetExamInfo.allowCommitTime
    },
    timeBetweenSecond(time) {
      return Math.floor((Date.parse(time) - Date.now()) / 1000)
    },
    initTab() {
      let _arr = []
      if (
        ~~this.methondId === ModuleTypeClass.integral.id ||
        ~~this.methondId === ModuleTypeClass.inquiry.id
      ) {
        // 病史采集
        _arr.push(ModuleTypeClass.inquiry.title)
      }
      if (
        ~~this.methondId === ModuleTypeClass.integral.id ||
        ~~this.methondId === ModuleTypeClass.physicalCheck.id
      ) {
        // 体格检查
        _arr.push(ModuleTypeClass.physicalCheck.title)
      }
      if (
        ~~this.methondId === ModuleTypeClass.integral.id ||
        ~~this.methondId === ModuleTypeClass.assistantStation.id
      ) {
        // 辅助检查
        _arr.push(ModuleTypeClass.medicalCheck.title)
      }
      // 接诊病人站
      if (
        ~~this.methondId === ModuleTypeClass.integral.id ||
        ~~this.methondId === ModuleTypeClass.caseCollectionStation.id
      ) {
        _arr.push(ModuleTypeClass.inquiry.title)
        _arr.push(ModuleTypeClass.physicalCheck.title)
        _arr.push(ModuleTypeClass.diagnosis.title)
      }
      // 病例分析站
      if (
        ~~this.methondId === ModuleTypeClass.integral.id ||
        ~~this.methondId === ModuleTypeClass.caseAnalysisStation.id
      ) {
        _arr.push(ModuleTypeClass.diagnosis.title)
        _arr.push(ModuleTypeClass.diagnosticBasis.title)
        _arr.push(ModuleTypeClass.auxiliaryExamination.title)
        _arr.push(ModuleTypeClass.treatment.title)
      }
      this.tabs = [...this.tabs, ..._arr]
      _arr = null
    },
    swiperChange(index) {
      this.swiperCurrent = index
    },
    async getCaseInfo() {
      let _userParam = getters.userParam,
        _caseId = getters.getTargetCaseId

      this.caseData = await this.$fetch.post(
        baseUrl + this.$api.cases.getInfo,
        {
          param: {
            caseId: _caseId,
            user_id: _userParam.user_id,
            user_select_caseCategoryKey: _userParam.user_select_caseCategoryKey,
            user_type: _userParam.user_type
          }
        }
      )
      this.methondId = this.caseData.moduleType
      // this.methondId = 10  //测试 test
      _userParam = null
      _caseId = null

      if (this.caseData && this.caseData.moduleType === 0) {
        uni.showModal({
          showCancel: false,
          content: '暂不支持整体病例相关考试',
          success: res => {
            if (res.confirm) {
              uni.reLaunch({
                url: '../main/main'
              })
            }
          }
        })
        return
      } else {
        this.initTab()
      }
    },
    examTimeCountdownFunc() {
      this.clearTimeout()
      let fixed = () => {
        this.examEndTimeSecond--
        if (this.examEndTimeSecond < 0) {
          this.examEndTimeSecond = 0
          this.postEndExam()
          return
        }
        this.countDown()
        count++
        var offset = new Date().getTime() - (startTime + count * 1000)
        var nextTime = 1000 - offset
        if (nextTime < 0) nextTime = 0
        console.log(offset)
        this.$examTimeInterval = setTimeout(fixed, nextTime)
      }
      this.$examTimeInterval = setTimeout(fixed, 1000)

      // this.$examTimeInterval = setInterval(() => {
      //   this.examEndTimeSecond--
      //   if (this.examEndTimeSecond < 0) {
      //     this.examEndTimeSecond = 0
      //     this.postEndExam()
      //     return
      //   }
      //   this.countDown()
      // }, 1000)
    },
    /**
     * 考试倒计时 计算函数
     */
    countDown() {
      seconds = this.examEndTimeSecond
      // day = Math.floor(seconds / (60 * 60 * 24))
      // hour = Math.floor(seconds / (60 * 60)) - day * 24 + ''
      // minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60 + ''
      // day = 0
      hour = Math.floor(seconds / (60 * 60)) + ''
      minute = Math.floor(seconds / 60) - hour * 60 + ''
      second = Math.floor(seconds) - hour * 60 * 60 - minute * 60 + ''
      this.examTimeCountdown =
        hour.padStart(2, '0') +
        ':' +
        minute.padStart(2, '0') +
        ':' +
        second.padStart(2, '0')
    },
    /**
     * 提交本站
     */
    endScene() {
      let _this = this,
        _platform = uni.getSystemInfoSync().platform
      if (targetExamId) {
        // 结束考试
        // 过早交卷
        let _mm =
          -this.timeBetweenSecond(_GMTToStr(targetExamInfo.first_time)) / 60
        if (_mm < targetExamAllowCommitTime) {
          uni.showToast({
            icon: 'none',
            title: '不允许过早交卷'
          })
          _mm = null
          return
        }
        _mm = null
        // 可以交卷
        uni.showModal({
          content: '确定提交本站答卷吗?',
          success: res => {
            if (res.confirm) {
              this.postEndExam()
            }
          }
        })
      } else {
        // 结束训练
        let _array = ['结束训练', '暂停训练']
        if (_platform === 'android') {
          _array.push('取消')
        }

        uni.showActionSheet({
          itemList: _array,
          success: function(res) {
            if (res.tapIndex === 0) {
              _this.showLoading = true
              if (targetExamId) {
                _this.$fetch
                  .post(baseUrl + _this.$api.exams.endScene, {
                    param: {
                      attendanceId: userId,
                      examId: targetExamId,
                      trainingId: quizId,
                      user_id: userId
                    }
                  })
                  .then(() => {
                    _this.$store.commit('practiceCanBack', true)
                    uni.navigateBack()
                  })
              } else {
                const _training = _this.$api.training
                _this.$fetch
                  .post(baseUrl + _training.endTraining, {
                    param: {
                      caseId: caseId,
                      quizId: quizId,
                      moduleType: _this.methondId,
                      headQuizId: quizId,
                      user_type: 'Student',
                      user_id: userId,
                      user_select_caseCategoryKey:
                        _this.$api.options.categoryKey
                    }
                  })
                  .then(() => {
                    let t = setTimeout(() => {
                      _this.$fetch
                        .post(baseUrl + _training.getTrainingScoreData, {
                          param: {
                            quizId: quizId,
                            user_type: 'Student',
                            user_id: userId,
                            isPractise:true
                          }
                        })
                        .then(res => {
                          if (res && res.scoreData) {
                            const _data = {
                              id: caseId,
                              score: res.scoreData.scoreData[0].score
                            }
                            _this.$store.commit('updateCaseScore', _data)
                          }
                          _this.$store.commit('practiceCanBack', true)
                          uni.navigateBack()
                        })
                      clearTimeout(t)
                      t = null
                    }, 500)
                  })
              }
            } else {
              _this.$store.commit('practiceCanBack', true)
              uni.navigateBack()
            }
          }
        })
        _array = null
      }
    },
    async getAnswer() {
      let _data = await this.$fetch.post(
        baseUrl + this.$api.training.getAnswer,
        {
          param: {
            quizId: getters.getQuizId,
            isPractise: isPractise
          }
        }
      )
      // 获取答案错误
      if (!_data) {
        uni.showModal({
          showCancel: false,
          content: '服务器错误',
          complete: function(res) {
            if (res.confirm) {
              uni.reLaunch({
                url: '../main/main'
              })
            }
          }
        })
      }
      this.answerData = Object.freeze(_data)
    },
    // 停止考试倒计时计时器
    clearTimeout() {
      if (this.$examTimeInterval) {
        clearTimeout(this.$examTimeInterval)
        this.$examTimeInterval = null
      }
    },
    postEndExam() {
      this.countdown = 0
      this.clearTimeout()
      this.showLoading = true
      let _getters = getters,
        _userParam = _getters.userParam
      this.$fetch
        .post(baseUrl + this.$api.exams.endScene, {
          param: {
            attendanceId: _userParam.user_id,
            examId: targetExamId,
            trainingId: _getters.getQuizId,
            user_id: _userParam.user_id,
            user_select_caseCategoryKey: _userParam.user_select_caseCategoryKey
          }
        })
        .then(res => {
          this.showLoading = false
          _getters = null
          // 多站考试，进入下一站
          if (res.caseId) {
            let _state = this.$store.state
            // 更新关键数据
            _state.targetCaseId = res.caseId
            _state.startExamData.quizId = res.quizId
            //手机端 本页跳转有bug 启用一个中间页过渡
            uni.reLaunch({
              url: './nextExam'
            })
          } else {
            this.clearTimeout()
            uni.showModal({
              showCancel: false,
              content: '考试已结束',
              complete: function(res) {
                if (res.confirm) {
                  uni.reLaunch({
                    url: '../main/main'
                  })
                }
              }
            })
          }
        })
    },
    //保存答案 提交server
    saveAnswer(obj) {
      this.$fetch.post(saveAnswerUrl, {
        param: {
          quizId: quizId,
          user_id: userId,
          answer: obj,
          isPractise: isPractise //3.3新增字段
        }
      })
    },
    // 内部子模块会调用
    gmtToStr(time) {
      return _GMTToStr(time)
    }
  },
  beforeDestroy() {
    // this.$store.commit('clearTargetExamData')
    this.clearTimeout()
    this.items = null
    this.examEndTimeSecond = null
    this.examData = null
    this.caseData = null
    this.methondId = null
    saveAnswerUrl = null
    quizId = null
    userId = null
    caseId = null
    targetExamAllowCommitTime = null
    targetExamInfo = null
    _GMTToStr = null
    seconds = null
    day = null
    hour = null
    minute = null
    second = null
    getters = null
    baseUrl = null
    targetExamId = null
    isPractise = null
    startTime = null
    count = null
  }
}
</script>

<style lang="scss">
@import '../../static/css/trainingOrExam.scss';
</style>
