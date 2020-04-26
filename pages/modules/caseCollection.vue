<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 诊断 模块
-->
<template>
  <view class="fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view class="uni-form-item" v-if="!showLoading" style="padding-top: 0;">
      <bottom-panel
        :showAnswerNum="false"
        :showProgress="false"
        :showPopBtn="false"
        :showDiagnosticLabel="true"
        :diagnosticLabel="studentSelectedDiagnosis.length"
      ></bottom-panel>
      <view class="title-view">
        <view class="label" v-once>诊断列表</view>
        <view class="btn-primary" v-once @tap="showDiagnosisPop">添加诊断</view>
      </view>
      <!-- 诊断    必要：0；次要：1；鉴别：3；疑似：2；-->
      <view style="margin-top: 120upx;">
        <view
          class="popup-list-item diagnosis-list"
          v-for="(item, index) of studentSelectedDiagnosis"
          :key="index"
        >
          <view class="name">{{ item.name }}</view>
          <view class="type">
            <picker
              @change="bindPickerChange"
              :range="diagnosisType"
              :data-current="index"
              :value="item.diagnosisType"
            >
              <view class="view-picker">
                <view class="txt">{{ diagnosisType[item.diagnosisType] }}</view>
                <view class="iconfont iconbianji"></view>
              </view>
            </picker>
          </view>
          <view
            class="iconfont iconshanchu del"
            @tap.stop="removeDiagnosis(index)"
          ></view>
        </view>
      </view>
    </view>

    <popup-layer ref="diagnosisPopup" :direction="'top'">
      <view class="popup-exam-history search-box">
        <view class="search-bar">
          <view style="flex: 1; margin:0 0 0 20upx;">
            <ty-search
              :showWant="false"
              :showHistory="false"
              @getSearchText="searchHandler"
              style="width: 620upx;"
            />
          </view>
          <view class="btn-close">
            <view class="iconfont iconqingkong" @tap="closeDiagnosisPop"></view>
          </view>
        </view>

        <view style="overflow-y: scroll;">
          <view class="search-hint" v-if="searchKeyword.length < 1">
            <view class="iconfont icontishi"></view>
            <view class="txt">
              Tips:
              <br />
              输入 关键字
              <br />
              搜索可用的检查项
            </view>
          </view>
          <view
            v-for="(item, index) of searchResult"
            :key="index"
            class="search-result-list"
            v-if="searchKeyword.length > 0"
          >
            <view class="txt">{{ item.name }}</view>
            <view
              class="iconfont iconhtmal5icon18"
              @tap.stop="checkboxChange(index)"
            ></view>
          </view>

          <view
            class="data-error no-data"
            v-if="
              !showLoading &&
                searchKeyword.length > 0 &&
                searchResult.length < 1
            "
          >
            <view>没有相关诊断</view>
          </view>
        </view>
      </view>
    </popup-layer>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import tySearch from '@/components/@tellyes-vue/ty-search/ty-search.vue'
import bottomPanel from './components/bottom-panel.vue'
export default {
  components: { tySearch, bottomPanel },
  data() {
    return {
      showLoading: true,
      diagnosisBasicData: null,
      searchKeyword: '',
      diagnosisType: ['必要', '次要', '疑似', '鉴别'],
      searchResult: []
    }
  },
  props: {
    //学生答题数据
    studentAnswerData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: mapState(['studentSelectedDiagnosis']),
  watch: {
    studentSelectedDiagnosis: {
      handler(newVal, oldVal) {
        if (this.showLoading) return
        this.answerHandler()
      },
      deep: true
    }
  },
  mounted() {
    let t = setTimeout(() => {
      this.initData()
      clearTimeout(t)
      t = null
    }, 1210)
    // this.$store.state.studentSelectedDiagnosis = []
    // this.$store.state.studentSelectedDiagnosis = this.selectedDiagnosis
  },
  methods: {
    initData() {
      this.showLoading = true
      // this.getDiagnosisBasicData()
      this.processStudentAnswerData()
    },
    processStudentAnswerData() {
      let _obj = null
      this.studentAnswerData.forEach(item => {
        if (!item.isDeleted) {
          const _diagnosisType =
            item.diagnosisTypeAnswers[item.diagnosisTypeAnswers.length - 1]
              .diagnosisType
          _obj = {
            id: item.diagnosisItemId,
            name: item.name || '',
            diagnosisType: _diagnosisType,
            bases: item.bases.filter(base => {
              return (
                base.basisTypeAnswers[base.basisTypeAnswers.length - 1]
                  .basisType === (_diagnosisType === 3 ? 2 : 1)
              )
            })
          }
          _obj.bases.forEach(base => {
            if (!base.type) {
              base.type = base.categoryId ? 'inquiries' : 'physicalChecks'
            }
          })
          this.studentSelectedDiagnosis.push(_obj)
          // this.$store.state.studentSelectedDiagnosis.push(_obj)
        }
      })
      let t = setTimeout(() => {
        this.showLoading = false
        clearTimeout(t)
        t = null
      }, 100)
    },
    showDiagnosisPop() {
      this.$refs.diagnosisPopup.show()
    },
    closeDiagnosisPop() {
      this.$refs.diagnosisPopup.close()
      let t = setTimeout(() => {
        this.searchResult = []
        this.searchKeyword = ''
        clearTimeout(t)
        t = null
      }, 500)
    },
    checkboxChange(index) {
      let _obj = this.searchResult[index]
      let _idx = this.studentSelectedDiagnosis.findIndex(
        item => item.id === _obj.id
      )
      // let _idx = this.selectedDiagnosis.findIndex(item => item.id === _obj.id)
      if (_idx < 0) {
        _obj.diagnosisType = 0
        // this.selectedDiagnosis.push(_obj)
        this.studentSelectedDiagnosis.push(_obj)
      }
      this.searchResult.splice(index, 1)
      let t = setTimeout(() => {
        uni.showToast({
          icon: 'none',
          title: '添加成功'
        })
        clearTimeout(t)
        t = null
        // this.answerHandler()
      }, 100)
    },
    bindPickerChange(e) {
      const curindex = e.target.dataset.current
      let _originObj = this.studentSelectedDiagnosis[curindex]
      // let _originObj = this.selectedDiagnosis[curindex]
      if (_originObj.diagnosisType === e.target.value) {
        return
      }
      let _obj = {
        ..._originObj
      }
      _obj.diagnosisType = e.target.value
      this.$set(this.studentSelectedDiagnosis, curindex, _obj)
      // this.$set(this.selectedDiagnosis, curindex, _obj)
      // this.$set(this.$store.state.studentSelectedDiagnosis, curindex, _obj)
      // this.answerHandler()
      // this.selectedDiagnosis[curindex].diagnosisType = e.target.value
    },
    // 保存答案
    answerHandler() {
      let _newObj = null
      const _time = this.$root.gmtToStr(Date.now())
      const _inquiryObj = { diagnoses: [] }
      this.studentSelectedDiagnosis.forEach(item => {
        // this.selectedDiagnosis.forEach(item => {
        _newObj = {
          diagnosisClass: 0,
          diagnosisItemId: item.id,
          name: item.name,
          diagnosisTypeAnswers: [
            { diagnosisType: item.diagnosisType, time: _time }
          ],
          bases: [
            // {
            //   sourceType: 0,
            //   categoryId: '',
            //   explainId: '',
            //   basisTypeAnswers: [
            //     {
            //       basisType: 1,
            //       time: _time
            //     }
            //   ]
            // }
          ],
          addTime: _time,
          isDeleted: false,
          deleteTime: ''
        }

        if (item.bases) {
          item.bases.forEach(base => {
            let _baseObj = {
              sourceType: 0,
              categoryId: '',
              explainId: '',
              basisTypeAnswers: [
                {
                  basisType: 1,
                  time: _time
                }
              ]
            }
            _baseObj.sourceType = base.sourceType
            _baseObj.categoryId = base.categoryId
            _baseObj.explainId = base.explainId
            _newObj.bases.push(_baseObj)
          })
        }
        _inquiryObj.diagnoses.push(_newObj)
      })
      this.$root.saveAnswer(_inquiryObj)
    },
    removeDiagnosis(index) {
      uni.showModal({
        content: '确定删除吗?',
        success: res => {
          if (res.confirm) {
            // this.selectedDiagnosis.splice(index, 1)
            this.studentSelectedDiagnosis.splice(index, 1)
            // this.answerHandler()
          }
        }
      })
    },
    searchHandler(keyword) {
      if (!keyword || keyword.trim().length < 1) {
        return
      }
      this.searchKeyword = keyword
      this.showLoading = true

      this.$fetch
        .post(this.$api.baseUrl + this.$api.cases.searchDiagnostic, {
          param: {
            keyword: keyword,
            user_select_caseCategoryKey: parseInt(this.$api.options.categoryKey)
          }
        })
        .then(res => {
          if (res && res.data.length > 0) {
            this.searchResult = res.data
          } else {
            this.searchResult = []
          }
          this.showLoading = false
        })
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.$store.state.studentSelectedDiagnosis = []
    this.searchResult = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
.cont {
  padding: 20upx 0 0;
}
.title-view {
  padding: $ty-content-padding;
  display: flex;
  position: fixed;
  width: 690upx;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid $uni-bg-color-grey;
  .label {
    flex: 1;
    color: $uni-text-color-grey;
  }
  .btn-primary {
    margin-right: 0;
  }
}
.diagnosis-list /deep/ view {
  line-height: 1;
}
.diagnosis-list {
  display: flex;
  align-items: center;
  border-top: none;
  border-bottom: 1px solid $uni-bg-color-grey;
  width: 690upx;
  .name {
    flex: 1;
    font-size: $uni-font-size-base + 4;
  }
  .type {
    width: 140upx;
    text-align: center;
  }
  .view-picker {
    display: flex;
    justify-content: center;
    align-items: center;
    .txt {
      margin-right: 5px;
    }
  }
  .del {
    width: 80upx;
    text-align: right;
    font-size: 50upx;
  }
}
.search-box {
  // height: calc(100vh - 174rpx);
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.search-bar {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $uni-bg-color-grey;
  padding: 10upx 0;
}
.iconqingkong {
  width: 90upx;
  color: #ccc;
  font-size: 54upx;
  text-align: center;
  margin-right: 16upx;
}
.search-result-list {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $uni-bg-color-grey;
  padding: 0 $ty-content-padding;
  line-height: 1.8;
  .txt {
    flex: 1;
    font-size: $uni-font-size-lg - 2 !important;
  }
  .iconfont {
    font-size: 60upx;
    width: 90upx;
    text-align: right;
    color: $uni-color-primary;
  }
}
</style>
