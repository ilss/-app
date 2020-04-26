<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 辅助检查 模块
-->
<template>
  <view class="fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view v-if="!showLoading">
      <view class="data-error no-data" v-if="!medicalCheckData">
        <view class="btn-primary" @tap="initData">重新加载数据</view>
      </view>
      <!-- 辅助检查 -->
      <bottom-panel
        :showAnswerNum="false"
        :showProgress="false"
        :showPopBtn="false"
      ></bottom-panel>

      <view class="explain-list animated fadeIn">
        <view
          v-for="(answer, index) in medicalCheckData"
          class="item"
          :key="index"
          @tap="openPop(answer)"
        >
          {{ answer.name }}
        </view>

        <!-- <uni-collapse accordion="true">
          <uni-collapse-item
            v-for="(answer, index) in medicalCheckData"
            :key="index"
            :title="answer.name"
            class="explain-list"
          >
            <view v-for="(data, index) in answer.data" :key="index">
              <view v-for="(item, index) in data" :key="index">
                <view
                  v-if="item.explainItems"
                  v-for="(explain, explainIndex) in item.explainItems"
                  :key="explainIndex"
                  class="explain-title"
                >
                  {{ explain.name }} {{ explain.id }}
                  <view v-if="!explain.explainAnswerItems">
                    <textarea
                      :data-medicalCheckExplainItemId="explain.id"
                      :data-explainAnswer="explain.subjectKeyWordItems[0].id"
                      :value="getAnswer(explain.id)"
                      @blur="textareaBlur"
                      class="check-textarea"
                    />
                  </view>
                  <radio-group
                    v-if="explain.explainAnswerItems"
                    :data-medicalCheckExplainItemId="explain.id"
                    @change="radioChange"
                  >
                    <label
                      v-for="(explainAnswer,
                      index) in explain.explainAnswerItems"
                      :key="index"
                      style="display: block;"
                    >
                      <radio
                        :data-medicalCheckExplainItemId="explain.id"
                        :value="explainAnswer.id"
                        :checked="isChecked(explainAnswer.id)"
                      />
                      {{ explainAnswer.name }} {{ explainAnswer.id }}
                    </label>
                  </radio-group>
                </view>
              </view>
            </view>
          </uni-collapse-item>
        </uni-collapse> -->
      </view>
    </view>

    <popup-layer ref="medicalQuestions" :direction="'top'">
      <view class="popup-exam-history">
        <view class="uni-flex pop-title">
          <view class="title">{{ popTitle }}</view>
          <view class="iconfont iconguanbi" @tap="closePop()"></view>
        </view>
        <view class="cont">
          <view
            v-for="(data, index) in popData.data"
            :key="data.id"
            class="list-time"
          >
            <view v-for="(item, index) in data" :key="item.id">
              <view
                v-if="item.explainItems"
                v-for="(explain, explainIndex) in item.explainItems"
                :key="explain.id"
              >
                <!-- <video
                v-show="false"
                :id="explain.id"
                controls="true"
                :title="explain.name"
                src="http://114.116.110.224:3005/producerResource/ff/ff0416ecdd17a96c4e67f6e45e067499.mp4"
              ></video> 
              
              -->
                <view class="video-player" v-if="item.hasVideo">
                  <video
                    v-if="canShowVideoPlayer"
                    style="width: 100%;"
                    direction="0"
                    controls="true"
                    v-for="(video, index) of item.resourcesUrl"
                    :key="index"
                    :src="video"
                  ></video>
                </view>
                <view class="list-cont">
                  <view class="explain-title uni-flex">
                    {{ explain.name }}
                    <!-- mp4 -->
                    <view
                      class="btn-play"
                      @tap.stop="playImage(item.resourcesUrl)"
                      v-if="item.hasImage"
                    >
                      查看图片
                    </view>
                  </view>

                  <view v-if="!explain.explainAnswerItems">
                    <textarea
                      :data-medicalcheckid="item.id"
                      :data-medicalcheckexplainitemid="explain.id"
                      :data-explainanswer="explain.subjectKeyWordItems[0].id"
                      :value="getAnswer(explain.id)"
                      placeholder="请输入答案"
                      @blur="textareaBlur"
                      class="check-textarea"
                    />
                  </view>
                  <radio-group
                    v-if="explain.explainAnswerItems"
                    :data-medicalcheckexplainitemid="explain.id"
                    :data-medicalcheckid="item.id"
                    @change="radioChange"
                  >
                    <label
                      v-for="(explainAnswer, idx) in explain.explainAnswerItems"
                      :key="explainAnswer.id"
                      style="display: block;"
                    >
                      <radio
                        :value="explainAnswer.id"
                        :checked="isChecked(explainAnswer.id)"
                      />
                      {{ explainAnswer.name }}
                    </label>
                  </radio-group>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </popup-layer>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import {
  uniList,
  uniListItem,
  uniSegmentedControl,
  uniCollapse,
  uniCollapseItem
} from '@dcloudio/uni-ui'
import bottomPanel from './components/bottom-panel.vue'
let _medicalCheckExplainAnswers
export default {
  components: {
    uniSegmentedControl,
    uniCollapse,
    uniCollapseItem,
    bottomPanel,
    uniList,
    uniListItem
  },
  props: {
    //学生答题数据
    studentAnswerData: {
      type: Object,
      default() {
        return { medicalCheckAnswers: [], medicalCheckExplainAnswers: [] }
      }
    }
  },
  data() {
    return {
      showLoading: true,
      canShowVideoPlayer: false,
      popTitle: '',
      popData: {},
      medicalCheckData: []
    }
  },
  computed: {
    // ...mapState(['meExamDataArray', 'serverTime'])
  },
  watch: {
    tempAnswer: 'saveAnswer'
  },
  // onReady: function(res) {
  // // 获取 video 上下文 videoContext 对象
  // this.videoContext = uni.createVideoContext('myVideo');
  // // 进入全屏状态
  // this.videoContext.requestFullScreen();
  // },
  mounted() {
    let t = setTimeout(() => {
      this.initData()
      _medicalCheckExplainAnswers = this.studentAnswerData
        .medicalCheckExplainAnswers
      clearTimeout(t)
      t = null
    }, 1272)
  },
  methods: {
    initData() {
      this.getCaseInquiry()
    },
    playVideo(id) {
      // 获取 video 上下文 videoContext 对象
      this.videoContext = uni.createVideoContext(id)
      // 进入全屏状态
      this.videoContext.requestFullScreen(0)
      this.videoContext.play()
    },
    /**
     * 获取问诊题库
     */
    async getCaseInquiry() {
      this.showLoading = true

      const _medicalCheckData = await this.$fetch.post(
        this.$api.baseUrl + this.$api.cases.getSpecialMedicalCheckInitData,
        {
          param: {
            caseId: this.$store.getters.getTargetCaseId
          }
        }
      )
      // 逻辑已移至服务器
      // _medicalCheckData.medicalCheckCategories.map(category => {
      //   if (category.type !== 0) {
      //     for (let a of category.children) {
      //       var temp = {
      //         id: a.id,
      //         name: a.name,
      //         type: category.type,
      //         children: [],
      //         data: [],
      //         visible: true
      //       }
      //       if (temp.priority === null) {
      //         temp.priority = 0
      //       }

      //       for (let t of a.medicalChecks) {
      //         var checkItem = {
      //           type: temp.type,
      //           data: t
      //         }

      //         if (
      //           checkItem.data.hasOwnProperty('explainItems') &&
      //           _medicalCheckData.medicalCheckAnswers.some(
      //             s =>
      //               s.medicalCheckId === t.id &&
      //               s.scoreType !== 2 &&
      //               s.scoreType !== 3
      //           )
      //         ) {
      //           temp.data.push(checkItem)
      //         }
      //       }
      //       if (temp.data.length > 0) {
      //         this.medicalCheckData.push(temp)
      //       }
      //     }
      //   }
      // })
      this.medicalCheckData = Object.freeze(_medicalCheckData.AECategories)
      this.showLoading = false
    },
    openPop(obj) {
      // console.log(obj)
      this.popTitle = obj.name

      obj.data.forEach(data => {
        if (data.data.resources && data.data.resources.length > 0) {
          data.data.resourcesUrl = []
          data.data.resources.forEach(resource => {
            if (
              resource.type === 'png' ||
              resource.type === 'jpeg' ||
              resource.type === 'jpg' ||
              resource.type === 'gif'
            ) {
              data.data.hasImage = true
            }
            if (
              resource.type === 'mp4' ||
              resource.type === 'avi' ||
              resource.type === 'mov'
            ) {
              data.data.hasVideo = true
            }
            data.data.resourcesUrl.push(
              this.$api.options.innerResource +
                resource.directory +
                '/' +
                resource.md5 +
                '.' +
                resource.type
            )
          })
        }
      })
      this.popData = obj
      let t = setTimeout(() => {
        this.canShowVideoPlayer = true
        clearTimeout(t)
        t = null
      }, 500)
      this.$refs.medicalQuestions.show()
    },
    closePop() {
      this.canShowVideoPlayer = false
      this.$refs.medicalQuestions.close()
    },
    //渲染学生选择题答案
    isChecked(meId) {
      if (_medicalCheckExplainAnswers.length < 1) {
        return false
      }
      return !!_medicalCheckExplainAnswers.find(
        item =>
          !item.explainItemAnswers[0].isDeleted &&
          item.explainItemAnswers[0].explainAnswer === meId
      )
    },
    getAnswer(meId) {
      let _res = {}
      _medicalCheckExplainAnswers.forEach(obj =>
        obj.explainItemAnswers.find(item => {
          if (
            !item.isDeleted &&
            item.isSubject &&
            item.medicalCheckExplainItemId === meId
          ) {
            _res = item
          }
        })
      )

      return _res.subjectExplainItemAnswers || ''
    },
    radioChange(e) {
      this.processingPostAnswer(
        e.currentTarget.dataset.medicalcheckexplainitemid,
        e.detail.value,
        e.currentTarget.dataset.medicalcheckid,
        ''
      )
    },
    textareaBlur(e) {
      this.processingPostAnswer(
        e.currentTarget.dataset.medicalcheckexplainitemid,
        e.currentTarget.dataset.explainanswer,
        e.currentTarget.dataset.medicalcheckid,
        e.detail.value
      )
    },
    playImage(arr) {
      this.$store.state.albumImagesArray = [...arr]
      uni.navigateTo({
        url: '../../pages/imageView/imageView'
      })
    },
    processingPostAnswer(
      medicalCheckExplainItemId,
      explainAnswer,
      medicalCheckId,
      data
    ) {
      let _medicalCheckAnswers = this.studentAnswerData.medicalCheckAnswers,
        _time = this.$root.gmtToStr(Date.now()),
        _res = {}
      _medicalCheckExplainAnswers.forEach(obj =>
        obj.explainItemAnswers.find(item => {
          if (
            !item.isDeleted &&
            item.medicalCheckExplainItemId === medicalCheckExplainItemId
          ) {
            _res = item
          }
        })
      )
      if (_res) {
        _res.isDeleted = true
        _res.deleteTime = _time
      }

      //如果检查已经存在 更新时间
      let _obj = _medicalCheckAnswers.find(
        item => item.medicalCheckId === medicalCheckId
      )
      if (_obj) {
        _obj.time = _time
      } else {
        _medicalCheckAnswers.push({
          order: _medicalCheckAnswers.length + 1,
          time: _time,
          medicalCheckId: medicalCheckId
        })
      }

      _medicalCheckExplainAnswers.push({
        explainItemAnswers: [
          {
            medicalCheckExplainItemId: medicalCheckExplainItemId,
            explainAnswer: explainAnswer,
            addTime: _time,
            isDeleted: false,
            deleteTime: null,
            subjectExplainItemAnswers: data || '',
            isSubject: data ? true : false
          }
        ],
        medicalCheckId: medicalCheckId
      })
      this.$root.saveAnswer(this.studentAnswerData)
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.popTitle = null
    this.canShowVideoPlayer = null
    this.popData = null
    this.medicalCheckData = null
    _medicalCheckExplainAnswers = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
.list-cont {
  padding: $ty-content-padding;
}
.explain-list {
  padding-bottom: 200upx;
  .item {
    line-height: $levelOneMenuLineHihgt;
    font-size: $uni-font-size-lg;
    border-bottom: 1px solid $uni-border-color;
    padding: 0 $ty-content-padding;
  }
}
.popup-exam-history {
  .explain-title {
    font-size: $uni-font-size-base + 2;
    color: $uni-color-primary;
    margin-bottom: 20upx;
    font-weight: bold;
  }
  .btn-play {
    border: 1px solid $uni-color-primary;
    border-radius: 100px;
    margin: 0 0 0 20upx;
    padding: 0 20upx;
    color: $uni-color-primary;
    font-size: $uni-font-size-base;
  }
}
.explain-title:before {
  counter-increment: one;
  content: counter(one) '. ';
}
</style>
