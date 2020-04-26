<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 病史采集 模块
-->
<template>
  <view>
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view
      class="data-error no-data"
      v-if="!showLoading && (!inquiryData || !inquiryData.inquiryCategories)"
    >
      <view class="btn-primary" @tap="initData">重新加载数据</view>
    </view>

    <view v-if="!showLoading && inquiryData && inquiryData.inquiryCategories">
      <bottom-panel
        ref="bottomPanel"
        :answerNum="computedAnswerNum"
        :progress="computedAnswerProgress"
        @handler="openPop"
      ></bottom-panel>
      <view class="animated fadeIn question-list">
        <!-- 病史采集 -->
        <view class="fixed search-view">
          <ty-chatBubble :initData="answerBubbleData" ref="chatBubble" />
          <ty-search
            :showWant="false"
            :showHistory="false"
            @getSearchText="searchStart"
            class="search-bar"
            style="width: 700upx; margin: auto;"
          />
        </view>
        <!-- //搜索结果 -->
        <view class="margin-top" v-show="searchKeyWord">
          <view
            class=""
            v-for="(inquiryCategorie, index) in inquiryData.inquiryCategories"
            :key="index"
          >
            <!-- v-show="new RegExp(searchKeyWord).test(explain.question)" -->
            <view
              v-for="(explain, index) in inquiryCategorie.inquiries"
              :key="index"
              v-show="isExist(explain) ? false : searchResult(explain.question)"
              @tap="answerHandler(JSON.stringify(explain))"
              class="collapse-item search-result"
            >
              {{ explain.question }}
            </view>
          </view>
        </view>
        <!-- //默认全显示 -->
        <view class="margin-top" v-show="!searchKeyWord">
          <uni-collapse accordion="true">
            <uni-collapse-item
              v-if="inquiryCategorie.inquiries"
              v-for="(inquiryCategorie, index) in inquiryData.inquiryCategories"
              :key="index"
              :title="
                inquiryCategorie.name +
                  '(' +
                  inquiryCategorie.inquiries.length +
                  ')'
              "
            >
              <view
                v-for="(explain, index) in inquiryCategorie.inquiries"
                :key="index"
                @tap="answerHandler(JSON.stringify(explain))"
                :class="['collapse-item', isExist(explain) ? 'disabled' : '']"
              >
                <view class="iconfont iconliaotian"></view>

                {{ explain.question }}
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
      </view>
    </view>

    <popup-layer ref="popupHistoryTaking" :direction="'top'">
      <view class="popup-exam-history">
        <view class="uni-flex pop-title" v-once>
          <view class="title">问诊记录</view>
          <view class="iconfont iconguanbi" @tap="closePop()"></view>
        </view>
        <ty-chatBubble
          :initData="answerBubbleData"
          :multiLine="true"
          ref="chatBubble"
        />
      </view>
    </popup-layer>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import { uniSegmentedControl } from '@dcloudio/uni-ui'
import uniCollapse from '@/components/@tellyes-vue/ty-collapse/ty-collapse.vue'
import uniCollapseItem from '@/components/@tellyes-vue/ty-collapse-item/ty-collapse-item.vue'
import tySearch from '@/components/@tellyes-vue/ty-search/ty-search.vue'
import tyChatBubble from '@/components/@tellyes-vue/ty-chatBubble/ty-chatBubble.vue'
import bottomPanel from './components/bottom-panel.vue'

export default {
  components: {
    uniSegmentedControl,
    uniCollapse,
    uniCollapseItem,
    tyChatBubble,
    tySearch,
    bottomPanel
  },
  props: {
    activeTabs: {
      type: Number,
      default: 1 //是否显示遮盖层
    },
    //学生答题数据
    studentAnswerData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showLoading: true,
      answerBubbleData: [],
      answerProgress: 100, //答题百分比进度条
      maxCount: null,
      inquiryData: null,
      inputOk: true, //问诊按钮开关  延时显示病人回复后才可继续问诊
      searchKeyWord: false
      //  studentAnswerData: this.$store.getters.get studentAnswerData
    }
  },
  computed: {
    // ...mapState(['meExamDataArray', 'serverTime']),
    computedAnswerNum() {
      let _studentAnswer = 0
      try {
        _studentAnswer = this.answerBubbleData.length
        return this.maxCount - _studentAnswer
      } catch (e) {
        console.warn(e)
      }
    },
    computedAnswerProgress() {
      let _studentAnswer = 0
      try {
        _studentAnswer = this.answerBubbleData.length
        return (
          parseInt(((this.maxCount - _studentAnswer) / this.maxCount) * 100) ||
          0
        )
      } catch (e) {
        console.warn(e)
      }
    }
  },
  watch: {
    // searchKeyWord: 'updateiInquiryList'
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.showLoading = true
      let t = setTimeout(() => {
        this.getCaseInquiry()
        clearTimeout(t)
        t = null
      }, 1070)
    },
    openPop() {
      this.$refs.popupHistoryTaking.show()
    },
    closePop() {
      this.$refs.popupHistoryTaking.close()
    },
    searchStart(txt) {
      this.searchKeyWord = txt
    },
    /**
     * 获取问诊题库
     */
    async getCaseInquiry() {
      this.inquiryData = Object.freeze(
        await this.$fetch.post(this.$api.baseUrl + this.$api.cases.getInquiry, {
          param: {
            caseId: this.$store.getters.getTargetCaseId
          }
        })
      )
      this.maxCount = this.inquiryData.maxCount
      if (this.studentAnswerData) {
        this.studentAnswerData.map(inquiry => {
          this.inquiryData.inquiryCategories.map(array => {
            if (array.inquiries && array.inquiries.length > 0) {
              let res = array.inquiries.find(item => {
                return item.id === inquiry.inquiryId
              })
              if (res) {
                this.answerBubbleData.push(res)
              }
            }
          })
        })
      }
      this.showLoading = false
    },
    isExist(obj) {
      return this.studentAnswerData.find(item => {
        return item.inquiryId === obj.id
      })
    },
    answerHandler(obj) {
      obj = JSON.parse(obj)
      let _timeout,
        _inquiryAnswer = this.studentAnswerData
      if (this.isExist(obj)) {
        uni.showToast({
          icon: 'none',
          title: '此问题已问过'
        })
        return
      }

      if (!this.inputOk) {
        uni.showToast({
          icon: 'none',
          title: '病人正在回答问题,请稍候提问.'
        })
        return
      } else {
        this.inputOk = false
      }

      const _inquiryObj = {
        inquiryId: obj.id,
        order: _inquiryAnswer.length + 1,
        time: this.$root.gmtToStr(Date.now())
      }
      _inquiryAnswer.push(_inquiryObj)
      this.answerBubbleData.push(obj)

      //问诊数量+1
      this.$root.saveAnswer({
        inquiryAnswers: _inquiryAnswer
      })
      _timeout = setTimeout(() => {
        this.inputOk = true
        clearTimeout(_timeout)
        _timeout = null
      }, 1200)
    },
    searchResult(question) {
      if (!this.searchKeyWord) {
        return true
      }
      const aSearchTextes = this.searchKeyWord.split(' ')
      for (let j = 0, len = aSearchTextes.length; j < len; j++) {
        if (question.indexOf(aSearchTextes[j]) > -1) {
          return true
        }
      }
      return false
    }
    // updateChatBubble() {
    //   if (~~this.activeTabs === 1) {
    //     this.$nextTick(() => {
    //       this.$refs.chatBubble.scrollToBottom()
    //     })
    //   }
    // }
  },
  beforeDestroy() {
    this.showLoading = null
    this.answerBubbleData = null
    this.answerProgress = null //答题百分比进度条
    this.inquiryData = null
    this.inputOk = null //问诊按钮开关  延时显示病人回复后才可继续问诊
    this.searchKeyWord = null
    this.maxCount = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
.module-view {
  padding-bottom: 220upx;
}
.question-list {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 174rpx);
}
.search-view {
  width: 100vw;
  height: 300upx;
  z-index: 9;
  background-color: #fff;
  padding-bottom: 30upx;
  border-bottom: 1px solid $uni-border-color;
}
.margin-top {
  padding-top: 340upx;
  flex: 1;
  padding-bottom: 200upx;
  overflow-y: scroll;
  overflow-x: hidden;
}
.disabled {
  opacity: 0.25;
}
.collapse-item {
  display: flex;
  align-items: center;
  line-height: 18px;
  background-color: #fff;
  padding: $ty-content-padding;
  border-top: 1px solid #efefef;
  .iconfont {
    margin-right: 10upx;
  }
}
.search-result {
  border-top: none;
  border-bottom: 1px solid #efefef;
}
.search-bar {
  padding-top: 30upx;
}
</style>
