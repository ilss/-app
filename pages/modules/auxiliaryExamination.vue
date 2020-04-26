<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 进一步检查模块
-->
<template>
  <view class="fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view v-if="!showLoading">
      <view class="data-error no-data" v-if="!checksListData">
        <view class="btn-primary" @tap="initData">重新加载数据</view>
      </view>
      <view
        class="uni-flex"
        style="height: 60upx; position: fixed; bottom:90upx;left: 30upx; color: #FFF; z-index: 100; width: 480upx;"
      >
        <view class="uni-flex-item" style="width: 210upx;">
          <bottomPanelProgress
            labelText="总检查项"
            barWidth="210"
            :currentNum="studentAnswerData.length"
            :maxNum="maxCount"
          ></bottomPanelProgress>
        </view>
        <view style="width: 220upx;">
          <bottomPanelProgress
            labelText="总花费"
            barWidth="220"
            :currentNum="totalCost"
            :maxNum="maxCostCount"
          ></bottomPanelProgress>
        </view>
      </view>
      <!-- 进一步检查 -->
      <bottom-panel
        :showAnswerNum="false"
        :showProgress="false"
        :showPopBtn="true"
        examTimeStyle="margin:60upx auto auto 0upx; width:260upx; padding:0;"
        showPopBtnStyle="margin:60upx auto auto 0upx"
        @handler="openLogPop"
      ></bottom-panel>

      <view class="explain-list animated fadeIn">
        <!-- <view
          v-for="(answer, index) in medicalCheckData.medicalCheckCategories[0]
            .medicalChecks"
          v-if="answer.medicalChecks.length > 0"
          class="item"
          :key="index"
          @tap="openPop(answer)"
        >
          {{ answer.name }}
        </view> -->

        <view
          v-for="(answer, index) in checksListData"
          v-if="answer.medicalChecks.length > 0"
          class="item"
          :key="index"
          @tap="openPop(answer)"
        >
          {{ answer.name }}
        </view>
      </view>
    </view>

    <popup-layer ref="medicalQuestions" :direction="'top'">
      <view class="popup-exam-history medical-questions">
        <view class="uni-flex title-view">
          <view class="title">{{ popTitle }}</view>
          <view class="iconfont iconguanbi" @tap="closePop()"></view>
        </view>
        <view class="medical-questions-cont">
          <checkbox-group @change="medicalChecksCheckboxHandler">
            <view
              v-for="(item, index) in popData.medicalChecks"
              :key="index"
              :class="['popup-list-item', item.isChecked ? 'disabled' : '']"
            >
              <label class="label">
                <checkbox
                  :value="item.id"
                  v-if="!allChecked"
                  :checked="isChecked(item)"
                  :disabled="item.isChecked || false"
                />
                <checkbox
                  :value="item.id"
                  v-else
                  checked="true"
                  :disabled="item.isChecked || false"
                />
                {{ item.name }}
              </label>
              <view class="cost">{{ item.cost | checkCost }}</view>
            </view>
          </checkbox-group>
        </view>
        <view class="bottom-panel">
          <view>
            <view class="uni-flex" style="height: 100upx;">
              <view class="uni-flex-item">
                <bottomPanelProgress
                  labelText="总检查项"
                  :currentNum="studentAnswerData.length"
                  :maxNum="maxCount"
                ></bottomPanelProgress>
              </view>
              <view style="width: 350upx;">
                <bottomPanelProgress
                  labelText="总花费"
                  barWidth="350"
                  :currentNum="totalCost"
                  :maxNum="maxCostCount"
                ></bottomPanelProgress>
              </view>
            </view>
          </view>

          <view class="uni-flex" style="margin-top:10upx;">
            <view style="width: 140upx; margin-right: 40upx; display: flex;">
              <checkbox-group @change="allCheckboxHandler">
                <checkbox value="all" :checked="allChecked" />
                全选
              </checkbox-group>
            </view>
            <view class="uni-flex-item">
              当前费用:
              <strong style="color:#F30;">
                {{ currentSelectCheckCost }}元
              </strong>
            </view>
            <view
              class="btn-primary"
              v-once
              style="color:#FFF; margin-right: 0;"
              @tap="saveAnswer()"
            >
              检 查
            </view>
          </view>
        </view>
      </view>
    </popup-layer>

    <popup-layer ref="popupHistoryTaking" :direction="'top'">
      <view class="popup-exam-history">
        <view class="uni-flex pop-title" v-once>
          <view class="title popupHistoryTakingBall">检查记录</view>
          <view class="iconfont iconguanbi" @tap="closeLogPop"></view>
        </view>
        <view class="cont" style="padding: 0;">
          <ty-list-no-data
            :canShow="studentAnswerData.length < 1"
            text="暂无检查记录"
          ></ty-list-no-data>
          <view
            v-for="(item, index) of studentAnswerData"
            :key="index"
            class="popup-list-item uni-flex"
            @tap.stop="getResultReport(index)"
          >
            <view class="uni-flex-item">
              {{ getMedicalCheckNameById(item) }}
            </view>
            <view class="iconfont icongengduo"></view>
          </view>
        </view>
      </view>
    </popup-layer>

    <!-- 检查结果 -->
    <popup-layer ref="popupReportDetail" :direction="'top'">
      <view class="popup-exam-history">
        <view class="uni-flex" style="border-bottom: 1px solid #EFEFEF;">
          <view class="title popupHistoryTakingBall">
            {{ currentReportObj.name }}检查报告单
          </view>
          <view class="iconfont iconguanbi" @tap="closeReportPop"></view>
        </view>
        <view class="cont" style="padding: 0;">
          <view class="report">
            <!-- <view class="title">{{ currentReportObj.name }}</view> -->
            <view class="basic-info">
              <view class="row padding-left">
                <view class="cell">姓名：张××</view>
                <view class="cell">性别：女</view>
                <view class="cell">年龄：63岁</view>
              </view>
              <view class="row padding-left">
                <view class="cell">科别：**</view>
                <view class="cell">住院号：**</view>
                <view class="cell">床位号：**</view>
              </view>
              <view class="row padding-left">临床诊断: ******</view>
            </view>

            <view
              class="detail-info"
              style="min-height: 300upx;"
              v-if="!currentReportObj.needForm"
            >
              <view class="row title-bar">
                <view class="cell name padding-left">名称</view>
                <view class="cell result">缩写</view>
                <view class="cell result">值</view>
                <view class="cell result">参考</view>
                <view class="cell unit">单位</view>
              </view>

              <view
                class="row"
                v-if="currentReportObj.medicalChecks.length > 0"
                v-for="(item, index) in currentReportObj.medicalChecks"
                :key="index"
              >
                <view class="padding-left cell name">
                  {{ item.name || '--' }}
                </view>
                <view class="cell result">{{ item.abbreviation || '--' }}</view>
                <view class="cell result">{{ item.result || '--' }}</view>
                <view class="cell result">
                  {{ item.referenceValue || '--' }}
                </view>
                <view class="cell unit">
                  {{ removeSup(item.unit) }}
                  <sup>{{ getSup(item.unit) }}</sup>
                  {{ getSupEnd(item.unit) }}
                </view>
              </view>
            </view>

            <view
              v-if="!currentReportObj.isCommon && currentReportObj.needForm"
              style="min-height: 300upx;"
            >
              <view style="font-weight: bold;" class="padding-left">
                检查所见
              </view>
              <view style="margin: 10px; font-size: 12px;">
                {{ currentReportObj.medicalChecks }}
              </view>
            </view>
            <view class="footer padding-left">
              <view class="hr">检查日期: ********** 医师签名: ***</view>
              <view>本报告仅供临床医师参考，不作为法律依据</view>
            </view>
          </view>
          <!-- <view
            v-for="item of studentAnswerData"
            class="popup-list-item"
            @tap.stop="
              getResultReport(item.medicalCheckAnswers || item.medicalCheckId)
            "
          >
            {{ getMedicalCheckNameById(item) }}
          </view> -->
        </view>
      </view>
    </popup-layer>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import { uniList, uniListItem,uniSegmentedControl,
  uniCollapse,
  uniCollapseItem } from '@dcloudio/uni-ui'
import bottomPanel from './components/bottom-panel.vue'
import bottomPanelProgress from './components/bottom-panel-progress.vue'
let currentSelectCheck = [], //当前选中的检查项数组
  tempCurrentCheckbox = [] // checkboxgroup 本次选中的项目id
export default {
  components: {
    uniSegmentedControl,
    uniCollapse,
    uniCollapseItem,
    bottomPanel,
    bottomPanelProgress,
    uniList,
    uniListItem
  },
  props: {
    //学生答题数据
    answerData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showLoading: true,
      showVideo: false,
      popTitle: '',
      maxCount: 0, //允许的最大检查数
      maxCostCount: 0, //允许的最大花费
      allChecked: null, //全选状态
      popData: {},
      totalCost: 0, //总花费
      medicalCheckData: null,
      currentSelectCheckCost: 0, //pop 里选择的检查后计算出的 当前花费
      studentAnswerData: [], //服务器返回的学生答题的数据
      checksListData: null, //2次整理的一级项目列表
      postAnswer: [], //暂存变动数据发送服务器
      currentReportObj: {} //报告单需要的数据
    }
  },
  computed: {},
  watch: {
    studentAnswerData: {
      handler(newVal, oldVal) {
        if (!this.medicalCheckData) return
        this.getCurrentSelectArray()
      },
      deep: true
    }
  },
  mounted() {
    let t = setTimeout(() => {
      this.initData()
      clearTimeout(t)
      t = null
    }, 1320)
  },
  methods: {
    initData() {
      this.showLoading = true
      //获取问诊题库
      this.getCaseInquiry()
      // console.log(this.studentAnswerData)
    },
    // 当前已做检查项，用于结算总费用，查看记录列表的数据
    getCurrentSelectArray() {
      if (!this.medicalCheckData) return
      currentSelectCheck = []
      // this.totalCheck = 0
      this.totalCost = 0
      this.studentAnswerData.forEach(obj => {
        let _data, _needForm
        // currentSelectCheck.push(this.getMedicalCheckNameById(item))
        if (obj.assayMedicalCheckCategoryId) {
          //化验单
          _data = this.medicalCheckData.medicalCheckCategories[0].medicalChecks.find(
            item => item.id === obj.assayMedicalCheckCategoryId
          )
          if (_data) {
            let _medicalChecks = []
            _data.medicalChecks.forEach(item => {
              let _exist = obj.medicalCheckAnswers.findIndex(
                o => o.medicalCheckId === item.id
              )
              if (_exist > -1) {
                if (item.needForm) {
                  _needForm = true
                }
                item.isChecked = true
                _medicalChecks.push(item)
                this.totalCost += item.cost
              }
            })
            currentSelectCheck.push({
              name: _data.name,
              needForm: _needForm,
              medicalChecks: _medicalChecks
            })
          }
        } else {
          let _array = this.medicalCheckData.medicalCheckCategories[1].children
          for (let i = 0, len = _array.length; i < len; i++) {
            _data = _array[i].medicalChecks.find(
              item => item.id === obj.medicalCheckId
            )
            if (_data) {
              _data.isChecked = true
              this.totalCost += _data.cost
              currentSelectCheck.push({
                name: _data.name,
                needForm: _data.needForm,
                medicalChecks: _data.result
              })
              break
            }
          }
        }
      })
    },
    async getCaseInquiry() {
      this.medicalCheckData = await this.$fetch.post(
        this.$api.baseUrl + this.$api.cases.getMedicalCheck,
        {
          param: {
            caseId: this.$store.getters.getTargetCaseId
          }
        }
      )
      if (!this.medicalCheckData) {
        this.showLoading = false
        return
      }
      this.maxCount = this.medicalCheckData.maxCount
      this.maxCostCount = this.medicalCheckData.maxCostCount
      this.studentAnswerData = [...this.answerData]
      // this.getCurrentSelectArray()

      this.checksListData = []
      this.medicalCheckData.medicalCheckCategories[0].medicalChecks.forEach(
        item => {
          item.type = this.medicalCheckData.medicalCheckCategories[0].type
          this.checksListData.push(item)
        }
      )
      this.medicalCheckData.medicalCheckCategories[1].children.forEach(item => {
        item.type = this.medicalCheckData.medicalCheckCategories[1].type
        this.checksListData.push(item)
      })
      // this.checksListData = [
      //   ...this.medicalCheckData.medicalCheckCategories[0].medicalChecks,
      //   ...this.medicalCheckData.medicalCheckCategories[1].children
      // ]
      this.showLoading = false
    },
    getResultReport(idx) {
      if (!this.medicalCheckData) return ''
      this.currentReportObj = currentSelectCheck[idx]
      this.$refs.popupReportDetail.show()
    },
    closeReportPop() {
      this.currentReportObj = {}
      this.$refs.popupReportDetail.close()
    },
    isChecked(obj) {
      if (obj.isChecked) {
        return true
      }
      if (this.allChecked === null) {
        if (obj.isCommon) {
          return true
        }
      }
      return false
    },
    allCheckboxHandler(e) {
      let _array = this.popData.medicalChecks
      this.clearTempCurrent()
      if (e.detail.value.length > 0) {
        let _cost = 0
        this.allChecked = true
        _array.forEach(item => {
          if (!item.isChecked) {
            _cost += item.cost
            tempCurrentCheckbox.push(item.id)
          }
        })
        this.currentSelectCheckCost = _cost
      } else {
        this.clearTempCurrent()
        this.allChecked = false
        this.currentSelectCheckCost = 0
      }
    },
    medicalChecksCheckboxHandler(e) {
      let _array = this.popData.medicalChecks,
        _cost = 0,
        _order = this.studentAnswerData.length + 1,
        _tempArray = [],
        _obj
      this.clearTempCurrent()

      // 计算当前花费
      _array.forEach(item => {
        if (e.detail.value.indexOf(item.id) > -1 && !item.isChecked) {
          _cost += item.cost
          tempCurrentCheckbox.push(item.id)
        }
      })
      this.currentSelectCheckCost = _cost
    },
    getMedicalCheckNameById(obj) {
      if (!this.medicalCheckData) return ''
      if (obj.assayMedicalCheckCategoryId) {
        //化验单
        return (
          this.medicalCheckData.medicalCheckCategories[0].medicalChecks.find(
            item => item.id === obj.assayMedicalCheckCategoryId
          ).name || '未知检查项'
        )
      } else {
        let _obj = null,
          _array = this.medicalCheckData.medicalCheckCategories[1].children
        for (let i = 0, len = _array.length; i < len; i++) {
          _obj = _array[i].medicalChecks.find(
            item => item.id === obj.medicalCheckId
          )
          if (_obj) {
            return _obj.name
          }
        }
      }
      return '未知检查项'
    },
    openLogPop() {
      this.$refs.popupHistoryTaking.show()
    },
    closeLogPop() {
      this.$refs.popupHistoryTaking.close()
    },
    openPop(obj) {
      this.popTitle = obj.name
      this.popData = obj
      this.allChecked = null //全选状态清空
      this.clearTempCurrent()
      this.allChecked = null
      let _array = this.popData.medicalChecks,
        _tempArray = [],
        _order = this.studentAnswerData.length + 1,
        _cost = 0

      _array.forEach(item => {
        if (item.isCommon && !item.isChecked) {
          _cost += item.cost
          tempCurrentCheckbox.push(item.id)
          // _tempArray.push({ medicalCheckId: item.id })
        }
      })
      this.currentSelectCheckCost = _cost
      this.$refs.medicalQuestions.show()
    },
    closePop() {
      this.$refs.medicalQuestions.close()
      let t = setTimeout(() => {
        this.popData = []
        this.allChecked = null
        clearTimeout(t)
        t = null
      }, 100)
    },
    getAnswer(meId) {
      if (
        !this.answerData[0] ||
        this.answerData[0].explainItemAnswers.length < 1
      ) {
        return ''
      }
      const _res = this.answerData.find(
        item => item.explainItemAnswers[0].medicalCheckExplainItemId === meId
      )
      if (!_res) {
        return ''
      }
      return _res.explainItemAnswers[0].subjectExplainItemAnswers || ''
    },
    removeSup(str) {
      if (!str) return '--'
      return str.replace(/\<sup\>\S+\<\/sup\>\S+/, '')
    },
    getSup(str) {
      if (!str) return ''
      if (str.indexOf('<sup>') < 0) {
        return ''
      }
      return str.replace(/\S+\<sup\>/, '').replace(/<\/sup\>\S+/, '')
    },
    getSupEnd(str) {
      if (!str) return ''
      if (str.indexOf('<sup>') < 0) {
        return ''
      }
      return str.replace(/\S+\<sup\>\S+\<\/sup\>/, '')
    },
    saveAnswer() {
      // console.log(tempCurrentCheckbox);
      if (tempCurrentCheckbox.length < 1) return

      const _cost = this.currentSelectCheckCost + this.totalCost
      if (_cost > this.maxCostCount) {
        let t = setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '花费超过上限'
          })
          clearTimeout(t)
          t = null
        }, 100)
        return
      }

      let _array = this.popData.medicalChecks,
        _tempSelectCheck = [],
        _tempArray = [],
        _order = this.studentAnswerData.length + 1
      // console.log(this.popData);
      if (this.popData.type !== 1) {
        //化验单
        _array.forEach(item => {
          if (tempCurrentCheckbox.indexOf(item.id) > -1 && !item.isChecked) {
            _tempArray.push({ medicalCheckId: item.id })
            item.isChecked = true
          }
        })
        _tempSelectCheck = [
          {
            time: this.$root.gmtToStr(Date.now()),
            assayMedicalCheckCategoryId: this.popData.id,
            medicalCheckAnswers: _tempArray,
            order: _order
          }
        ]
      } else {
        //报告单
        _array.forEach(item => {
          if (tempCurrentCheckbox.indexOf(item.id) > -1 && !item.isChecked) {
            item.isChecked = true
            _tempSelectCheck.push({
              time: this.$root.gmtToStr(Date.now()),
              order: _order++,
              medicalCheckId: item.id
            })
          }
        })
      }
      const _len = _tempSelectCheck.length + this.studentAnswerData.length
      if (_len > this.maxCount) {
        let t = setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '检查数超过上限'
          })
          clearTimeout(t)
          t = null
        }, 100)
        return
      }
      _tempSelectCheck.forEach(item => this.studentAnswerData.push(item))

      this.$root.saveAnswer({
        medicalCheckAnswers: this.studentAnswerData
      })
      this.currentSelectCheckCost = 0

      this.clearTempCurrent()
    },
    //清空已选检查缓存记录
    clearTempCurrent() {
      tempCurrentCheckbox = []
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.showLoading = null
    this.showVideo = null
    this.popTitle = null
    this.maxCount = null
    this.maxCostCount = null
    this.popData = null
    this.totalCost = null
    this.medicalCheckData = null
    this.currentSelectCheckCost = null
    this.studentAnswerData = null
    this.checksListData = null
    this.postAnswer = null
    this.currentReportObj = null
    currentSelectCheck = null
    tempCurrentCheckbox = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
.padding-left {
  padding-left: 4px !important;
}
.medical-questions {
  display: flex;
  flex-direction: column;
  .popup-list-item:nth-child(1) {
    border-top: none;
  }
}
.medical-questions-cont {
  flex: 1;
  overflow-y: auto;
  .disabled {
    opacity: 0.4;
  }
}
.explain-list {
  .item {
    line-height: $levelOneMenuLineHihgt;
    font-size: $uni-font-size-lg;
    border-bottom: 1px solid $uni-border-color;
    padding: 0 $ty-content-padding;
  }
}
.title-view {
  border-bottom: 1px solid $uni-border-color;
}
.bottom-panel {
  border-top: 1px solid #efefef;
  background-color: #fff;
  height: 200upx;
  padding: 0 $ty-content-padding;
}
.report {
  // padding-left: $paddingLeft;
  color: $uni-text-color-grey;
  padding-bottom: 30upx;
  .title {
    text-align: center;
    font-weight: bold;
  }
  .basic-info {
    padding: 30upx 0;
    // border-top: 1px solid $uni-border-color;
    border-bottom: 1px solid $uni-border-color;
    .row {
      display: flex;
      .cell {
        width: 33.33%;
        font-size: 12px;
      }
    }
  }
  .detail-info {
    padding: 0 0 30upx 0;
    .title-bar {
      // background-color: #d9edf6;
      color: #3c5e81;
      font-weight: bold;
    }
    .row {
      display: flex;
      .cell {
        font-size: 12px;
        padding: 4px 0;
      }
      .name {
        flex: 1;
      }
      .result {
        width: 18%;
      }
      .unit {
        width: 14%;
      }
    }
    .row:nth-child(even) {
      background-color: #fafafa;
    }
  }
  .footer {
    .hr {
      border-bottom: 1px solid $uni-border-color;
    }
  }
}
</style>
