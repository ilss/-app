<!--
*@Author: Liang Liang #skrjs.com 
*@Date: 2020-03-18 08:55:11 
*@Description: 治疗原则 模块 
-->
<template>
  <view class="cont fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view class="data-error no-data" v-if="!showLoading && !treatmentData">
      <view class="btn-primary" @tap="initData">重新加载数据</view>
    </view>
    <view
      class="uni-form-item uni-column animated fadeIn"
      v-once
      v-if="!showLoading && treatmentData"
    >
      <bottom-panel
        :showAnswerNum="false"
        :showProgress="false"
        :showPopBtn="false"
      ></bottom-panel>

      <!-- 治疗原则  2c4ef721-b4ab-11e8-b065-d7d9cc791dca -->
      <checkbox-group @change="checkboxChange">
        <view
          class="treatment-list"
          v-for="(item, index) of treatmentData"
          :key="index"
        >
          <label style="display: block;">
            <checkbox :value="item.id" :checked="isChecked(item.id)" />
            {{ item.name }}
          </label>
        </view>
      </checkbox-group>
    </view>
  </view>
</template>

<script>
import bottomPanel from './components/bottom-panel.vue'
export default {
  props: {
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
      treatmentData: null
    }
  },
  components: { bottomPanel },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.showLoading = true
      let t = setTimeout(() => {
        this.getTreatmentData()
        clearTimeout(t)
        t = null
      }, 1420)
    },
    async getTreatmentData() {
      let _obj = await this.$fetch.post(
        this.$api.baseUrl + this.$api.training.getTreatmentData,
        {
          param: {
            caseId: this.$store.getters.getTargetCaseId,
            user_select_caseCategoryKey: this.$store.getters.userParam
              .user_select_caseCategoryKey
          }
        }
      )
      _obj = _obj || { treatmentPrincipleItems: [] }
      this.treatmentData = Object.freeze(_obj.treatmentPrincipleItems)
      this.showLoading = false
    },
    checkboxChange(e) {
      const _values = e.detail.value
      let _answer = {
        studentTreatmentAnswer: { treatmentPrincipleItemAnswers: [] }
      }
      const _GMTToStr = this.$options.filters['GMTToStr']
      const _time = _GMTToStr(Date.now())
      _values.map(item => {
        const _obj = {
          answer: item,
          addTime: _time
        }
        _answer.studentTreatmentAnswer.treatmentPrincipleItemAnswers.push(_obj)
      })
      this.$root.saveAnswer(_answer)
    },
    //渲染学生选择题答案
    isChecked(id) {
      if (this.studentAnswerData.length < 1) {
        return false
      }
      return this.studentAnswerData.some(item => item.answer === id)
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.treatmentData = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
</style>
