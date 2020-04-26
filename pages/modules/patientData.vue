<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 患者信息 模块
-->
<template>
  <view class="cont">
    <ty-data-loading v-if="showLoading"></ty-data-loading>

    <view
      class="data-error no-data"
      v-if="!showLoading && (!patientData || !patientData.medicalHistoryInfo)"
    >
      <view class="btn-primary" @tap="initData()">重新加载数据</view>
    </view>
    <view
      v-if="!showLoading && patientData && patientData.medicalHistoryInfo"
      class="patient-data margin-top animated fadeIn"
      v-once
    >
      <view class="case-name">{{ patientData.caseInfo.caseName }}</view>

      <!-- 患者信息 -->
      <view class="base-info">
        <view class="sub">
          {{ patientData.medicalHistoryInfo.patientName }} |
          {{ patientData.medicalHistoryInfo.gender ? '女' : '男' }} |
          {{ patientData.medicalHistoryInfo.age || '--' }}
        </view>

        <view class="main">
          {{ patientData.medicalHistoryInfo.clinicTime || 0 | GMTToStr }}
        </view>
      </view>

      <view class="more-info">
        症状：{{ patientData.medicalHistoryInfo.chiefComplaint || '--' }}
      </view>

      <view class="more-info">
        病例描述：{{ patientData.medicalHistoryInfo.anamnesisDesc || '--' }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showLoading: true,
      patientData: null
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.showLoading = true
      let t = setTimeout(() => {
        this.getPatientInfo()
        clearTimeout(t)
        t = null
      }, 1000)
    },
    getMarital() {
      const _mid = this.patientData.medicalHistoryInfo.maritalStatusId
      const _mStatusArray = this.patientData.maritalStatus
      const _item = _mStatusArray.find(item => {
        return item.id === _mid
      })
      return _item ? _item.name : '--'
    },
    async getPatientInfo() {
      // 获取病人信息
      const _caseId = this.$store.getters.getTargetCaseId
      const _postData = {
        param: {
          caseId: _caseId,
          user_select_caseCategoryKey: this.$api.options.categoryKey
        }
      }
      const _url = this.$api.baseUrl + this.$api.patient.getInfo
      this.patientData = Object.freeze(await this.$fetch.post(_url, _postData))
      this.showLoading = false
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.patientData = null
  }
}
</script>

<style lang="scss" scoped>
.cont {
  padding: 20upx 0 0;
}
.case-name {
  font-size: $uni-font-size-lg;
  font-weight: bold;
}
.patient-data {
  margin: 0 $ty-content-padding;
}
.base-info {
  $pb: 20upx;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid $uni-border-color;
  padding-bottom: $pb;
  margin-bottom: $pb;
  color: $uni-text-color-sub;
  .sub {
    flex: 1;
  }
  .main {
    width: 400upx;
    text-align: right;
  }
}
.more-info {
  font-size: $uni-font-size-lg;
}
</style>
