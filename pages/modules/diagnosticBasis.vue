<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 诊断依据 模块
-->
<template>
  <view class="fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view class="uni-form-item uni-column" v-if="!showLoading">
      <bottom-panel
        :showAnswerNum="false"
        :showProgress="false"
        :showPopBtn="false"
      ></bottom-panel>

      <view
        class="search-hint"
        v-if="!showLoading && studentSelectedDiagnosis.length < 1"
      >
        <view class="iconfont icontishi"></view>
        <view class="txt">
          Tips:
          <br />
          需要先添加诊断
        </view>
      </view>

      <!-- <view>诊断依据</view> -->
      <uni-collapse accordion="true">
        <uni-collapse-item
          v-for="(item, index) in studentSelectedDiagnosis"
          :key="index"
          :title="item.name"
          class="basic-list"
        >
          <view class="cont">
            <view class="controller" @tap.stop="showDiagnosisPop(index)">
              <view class="name">
                {{ item.diagnosisType === 3 ? '不支持依据' : '支持依据' }}
              </view>
              <view class="iconfont iconbianji"></view>
            </view>
            <view class="explain-answer">
              <view
                class="item"
                v-for="(explain, index) in item.bases"
                :key="index"
              >
                {{ getBaseAnswerById(explain.categoryId, explain.explainId) }}
              </view>
            </view>
          </view>

          <!-- <view
            v-for="(explain, index) in inquiryCategorie.children"
            :key="index"
            class="popup-list-item physical-item"
            @tap="answerHandler($event, explain)"
          >
            
          </view> -->
        </uni-collapse-item>
      </uni-collapse>

      <!-- 诊断依据 -->
    </view>

    <popup-layer ref="diagnosisPopup" :direction="'top'">
      <view class="popup-exam-history search-box">
        <view class="search-bar">
          <view
            class="title"
            v-if="studentSelectedDiagnosis[currentDiagnosisIndex]"
          >
            {{
              studentSelectedDiagnosis[currentDiagnosisIndex].diagnosisType ===
              3
                ? '不支持依据'
                : '支持依据'
            }}
            - {{ studentSelectedDiagnosis[currentDiagnosisIndex].name }}
          </view>
          <view class="btn-close">
            <view class="iconfont iconqingkong" @tap="closeDiagnosisPop"></view>
          </view>
        </view>
        <!-- TAB页 -->

        <view class="gist-tab">
          <view
            class="item"
            v-show="supportData.inquiries.length > 0"
            @tap.stop="setGistTabIndex(0)"
            :class="gistTabIndex === 0 ? 'current' : ''"
          >
            问诊问诊
          </view>
          <view
            class="item"
            v-show="supportData.physicalChecks.length > 0"
            @tap.stop="setGistTabIndex(1)"
            :class="gistTabIndex === 1 ? 'current' : ''"
          >
            体格检查
          </view>
          <!-- <view
            class="item"
            v-show="supportData.medicalChecks.length > 0"
            @tap.stop="setGistTabIndex(2)"
            :class="gistTabIndex === 2 ? 'current' : ''"
          >
            辅助检查
          </view> -->
        </view>
        <view class="gist-cont">
          <view v-show="gistTabIndex === 0 && supportData.inquiries.length > 0">
            <checkbox-group
              @change="gistCheckboxChange"
              data-supportdata="inquiries"
            >
              <label
                v-for="(item, index) in supportData.inquiries"
                :key="index"
              >
                <checkbox
                  :value="item.explainId"
                  :checked="baseIsChecked(item.explainId, 'inquiries')"
                />
                {{ item.explainAnswer }}
              </label>
            </checkbox-group>
          </view>
          <view
            v-show="gistTabIndex === 1 && supportData.physicalChecks.length > 0"
          >
            <checkbox-group
              @change="gistCheckboxChange"
              data-supportdata="physicalChecks"
            >
              <label
                v-for="(item, index) in supportData.physicalChecks"
                :key="index"
              >
                <checkbox
                  :value="item.explainId"
                  :checked="baseIsChecked(item.explainId, 'physicalChecks')"
                />
                {{ item.explainAnswer }}
              </label>
            </checkbox-group>
          </view>
          <!-- <checkbox-group
            @change="gistCheckboxChange"
            data-supportdata="medicalChecks"
          >
            <view
              v-if="gistTabIndex === 2 && supportData.medicalChecks.length > 0"
            >
              <label
                class=""
                v-for="(item, index) in supportData.medicalChecks"
                :key="index"
              >
                <checkbox :value="item.explainId" />
                {{ item.explainAnswer }}
              </label>
            </view>
          </checkbox-group> -->
        </view>
      </view>
    </popup-layer>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import uniCollapse from '@/components/@tellyes-vue/ty-collapse/ty-collapse.vue'
import uniCollapseItem from '@/components/@tellyes-vue/ty-collapse-item/ty-collapse-item.vue'
import bottomPanel from './components/bottom-panel.vue'
export default {
  components: {
    uniCollapse,
    uniCollapseItem,
    bottomPanel
  },
  data() {
    return {
      showLoading: false,
      gistTabIndex: 0,
      supportData: {
        inquiries: [],
        physicalChecks: [],
        medicalChecks: []
      },
      selectedDiagnosis: [],
      currentDiagnosisIndex: null,
      currentDiagnosisBases: null
    }
  },
  computed: mapState(['studentSelectedDiagnosis']),
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      //获取诊断依据项列表
      let t = setTimeout(() => {
        this.getDiagnosisSupport()
        clearTimeout(t)
        t = null
      }, 1330)
    },
    async getDiagnosisSupport() {
      const _moduleType = this.$api.ModuleTypeClass
      this.supportData = await this.$fetch.post(
        this.$api.baseUrl + this.$api.cases.getDiagnosisSupport,
        {
          param: {
            caseId: this.$store.getters.getTargetCaseId,
            modules: [_moduleType.inquiry.id, _moduleType.physicalCheck.id]
          }
        }
      )
    },
    showDiagnosisPop(idx) {
      this.currentDiagnosisIndex = idx
      let _arr = this.studentSelectedDiagnosis[idx].bases
      this.currentDiagnosisBases = _arr ? _arr : []
      let t = setTimeout(() => {
        this.$refs.diagnosisPopup.show()
        clearTimeout(t)
        t = null
      }, 50)
    },
    closeDiagnosisPop() {
      this.$refs.diagnosisPopup.close()
    },
    getBaseAnswerById(categoryId, explainId) {
      const _inquiries = this.supportData.inquiries,
        _physicalChecks = this.supportData.physicalChecks
      if (categoryId) {
        for (let i = 0, len = _inquiries.length; i < len; i++) {
          const _obj = _inquiries[i]
          if (_obj.categoryId === categoryId && _obj.explainId === explainId) {
            return '问-' + _obj.explainAnswer
          }
        }
      } else {
        for (let i = 0, len = _physicalChecks.length; i < len; i++) {
          const _obj = _physicalChecks[i]
          if (_obj.explainId === explainId) {
            return '体-' + _obj.explainAnswer
          }
        }
      }
    },
    baseIsChecked(explainId, type) {
      if (
        this.currentDiagnosisIndex === null ||
        this.currentDiagnosisBases === null ||
        this.currentDiagnosisBases.length < 1
      ) {
        return false
      }

      const _bases = this.currentDiagnosisBases
      if (!_bases || _bases.length < 1) return false
      for (let i = 0, len = _bases.length; i < len; i++) {
        let _obj = _bases[i]
        if (_obj.type === type && _obj.explainId === explainId) {
          return true
        }
      }
      return false
    },
    setGistTabIndex(idx) {
      this.gistTabIndex = idx
    },
    gistCheckboxChange(e) {
      let _arrExplainId = e.detail.value,
        _type = e.target.dataset.supportdata,
        _supportdata = this.supportData[_type],
        _arrBasesTemp = [],
        _studentSelectedDiagnosis = this.studentSelectedDiagnosis[
          this.currentDiagnosisIndex
        ]
      if (_studentSelectedDiagnosis.bases) {
        let _arrBases = [..._studentSelectedDiagnosis.bases]
        //删除同类bases
        if (_arrBases.length > 0) {
          _arrBasesTemp = _arrBases.filter(item => item.type !== _type)
        }
      }

      //更新同类bases
      _arrExplainId.forEach(id => {
        let _obj = _supportdata.find(item => item.explainId === id)
        _obj.type = _type
        _arrBasesTemp.push(_obj)
      })

      this.$set(
        this.studentSelectedDiagnosis[this.currentDiagnosisIndex],
        'bases',
        _arrBasesTemp
      )
    }
  },
  beforeDestroy() {
    this.showLoading = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';

.basic-list {
  border-bottom: 16upx solid $uni-bg-color-grey;
}

.cont {
  padding: 10upx $ty-content-padding $ty-content-padding;
  background-color: #fff;
}

.explain-answer {
  counter-reset: counter_h1;

  .item {
    counter-increment: counter_h1;
    color: $uni-text-color-grey;
  }

  .item::before {
    content: counter(counter_h1) '. ';
  }
}

.controller {
  display: flex;

  .name {
    flex: 1;
  }
}

.search-box {
  // height: calc(100vh - 174rpx);
  display: flex;
  flex-direction: column;
  background-color: $uni-bg-color-grey;
}

.search-bar {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $uni-bg-color-grey;
  // padding: 10upx 0;
  height: 70upx;
  background-color: #fff;

  .title {
    flex: 1;
    margin: 0 0 0 20upx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.iconqingkong {
  width: 90upx;
  color: #ccc;
  font-size: 54upx;
  text-align: center;
  margin-right: 16upx;
}

.current-diagnosis {
  background-color: #fff;
}

.gist-tab {
  display: flex;
  background-color: #fff;

  .current {
    position: relative;
  }

  .current::after {
    content: '';
    position: absolute;
    left: 30%;
    top: auto;
    bottom: 0;
    right: auto;
    height: 8upx;
    width: 40%;
    border-radius: 10px;
    background-color: $uni-color-warning;
  }

  .item {
    padding: 20upx 30upx 16upx 30upx;
  }
}

.gist-cont {
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10upx $ty-content-padding;
  label {
    display: block;
    padding: 14upx 0;
    display: flex;
  }
}
</style>
