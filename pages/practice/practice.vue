<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 练习列表页面
-->
<template>
  <view class="content">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <sl-filter
      :ref="'slFilter'"
      :topFixed="true"
      :needConfirmButton="false"
      themeColor="#0B1D51"
      :menuList="menuList"
      @result="result"
    ></sl-filter>
    <view class="case-list">
      <ty-list-no-data
        :canShow="!showLoading && (!caseData || caseData.cases.length < 1)"
        text="无可用病例"
      ></ty-list-no-data>
      <view v-if="!showLoading && caseData">
        <view
          class="case animated fadeIn"
          v-if="
            (caseData.cases.length > 0 && targetDivision === 'all') ||
              targetDivision === item.data.medicalHistoryInfo.divisionId
          "
          v-for="(item, index) of caseData.cases"
          :key="item._id"
        >
          <view class="name single-row-ellipsis">{{ item.name || '--' }}</view>
          <view class="info">
            <view class="division">
              {{ getDivision(item.data.medicalHistoryInfo.divisionId) }}
            </view>
            <view class="score">{{ item.correctnessScore + '分' }}</view>
            <view
              class="primary"
              @tap="startTrainingHandler(caseData.cases[index]._id)"
            >
              开始练习
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import { uniList, uniListItem } from '@dcloudio/uni-ui'
import slFilter from '@/components/@tellyes-vue/ty-filter/ty-filter.vue'
let divisionsArray = [
    {
      title: '全部科室',
      value: 'all'
    }
  ],
  getCaseCategory

export default {
  data() {
    return {
      showLoading: true,
      canClick: true,
      menuList: [],
      caseData: null,
      targetModuleId: null,
      targetDivision: 'all'
    }
  },
  components: { uniList, uniListItem, slFilter },
  computed: {
    // ...mapState(['caseListData'])
  },
  watch: {
    // caseData: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal)
    //   },
    //   deep: true
    // }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      // console.log(this.$store.getters.getCaseCategory);
      getCaseCategory = this.$store.getters.getCaseCategory || []
      if (getCaseCategory.length < 1) {
        this.showLoading = false
        return
      }
      this.menuList = [
        {
          title: getCaseCategory[0].title,
          isMutiple: false,
          key: 'category',
          isMutiple: false,
          defaultSelectedIndex: 0,
          detailList: [...getCaseCategory]
        },
        {
          title: '全部科室',
          key: 'division',
          isMutiple: false,
          defaultSelectedIndex: 0,
          detailList: divisionsArray
        }
      ]
      this.targetModuleId = getCaseCategory[0].value

      let t = setTimeout(() => {
        this.LoadCaseData(getCaseCategory[0].value)
        clearTimeout(t)
        t = null
      }, 340)
    },
    LoadCaseData(obj) {
      this.showLoading = true
      const _userParam = this.$store.getters.userParam
      // const _url = this.$api.baseUrl + this.$api.cases.getList
      // let _caseData = this.$fetch.post(_url, {
      //   param: {
      //     type: ~~obj.id,
      //     user_id: _userParam.user_id,
      //     user_select_caseCategoryKey: _userParam.user_select_caseCategoryKey,
      //     user_type: _userParam.user_type
      //   }
      // })
      let _param = {
        param: {
          type: ~~obj.id,
          user_id: _userParam.user_id,
          user_select_caseCategoryKey: _userParam.user_select_caseCategoryKey,
          user_type: _userParam.user_type
        }
      }

      _param = this.$encryption(_param)
      uni.request({
        url: this.$api.baseUrl + this.$api.cases.getList,
        data: _param,
        method: 'POST',
        success: res => {
          let _data = this.$decryption(res.data)
          if (!_data.success) {
            this.showLoading = false
            let t = setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: _data.msg
              })
              clearTimeout(t)
              t = null
            }, 100)
            return
          }
          this.$store.commit('initCaseListData', _data.data)
          let t = setTimeout(() => {
            this.caseData = this.$store.state.caseListData
            this.updateDivisionsArray(this.caseData)
            this.updateMenuData()
            this.showLoading = false
            clearTimeout(t)
            t = null
          }, 100)
        },
        fail: () => {
          this.$store.commit('initCaseListData', { cases: [] })
          this.caseData = this.$store.state.caseListData
          let t = setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '服务器无法访问'
            })
            clearTimeout(t)
            t = null
          }, 100)
          this.showLoading = false
        },
        complete: () => {
          // uni.hideLoading()
          // this.showLoading = false
        }
      })
    },
    updateMenuData() {
      this.menuList[0].defaultSelectedIndex = getCaseCategory.findIndex(
        item => {
          return item.value === this.targetModuleId
        }
      )
      this.menuList[1].detailList = divisionsArray
      // this.menuList[1].defaultSelectedIndex = 0
      this.$refs.slFilter.resetMenuList(this.menuList)
    },
    //过滤出有数据的科室存入筛选条件数组
    updateDivisionsArray(caseData) {
      divisionsArray = [
        {
          title: '全部科室',
          value: 'all'
        }
      ]

      caseData.cases.map(data => {
        const _division = this.caseData.divisions.find(item => {
          return item.id === data.data.medicalHistoryInfo.divisionId
        })
        if (_division && _division.name) {
          let res = divisionsArray.find(item => {
            return item.value === _division.id
          })
          if (!res) {
            divisionsArray.push({
              title: _division.name,
              value: _division.id
            })
          }
        }
      })
    },
    result(val) {
      if (this.targetDivision !== val.division) {
        this.targetDivision = val.division
      }
      if (this.targetModuleId !== val.category) {
        this.targetModuleId = val.category
        this.targetDivision = 'all'
        this.LoadCaseData(this.targetModuleId)
      }
    },
    getDivision(id) {
      const _division = this.caseData.divisions.find(item => {
        return item.id === id
      })
      if (_division && _division.name) {
        return _division.name
      }
      return '无类别'
    },
    startTrainingHandler(id) {
      if (this.canClick) {
        this.canClick = false
        let t = setTimeout(() => {
          this.canClick = true
          clearTimeout(t)
          t = null
        }, 1000)
      } else {
        return
      }

      this.$store.commit('setTargetCaseId', id)
      const _userId = this.$store.getters.userParam.user_id,
        { categoryKey } = this.$api.options
      uni.request({
        url: this.$api.baseUrl + this.$api.training.start,
        method: 'POST',
        data: {
          param: {
            caseId: id,
            user_id: _userId,
            moduleType: this.targetModuleId.id,
            user_select_caseCategoryKey: categoryKey
          }
        },
        success: res => {
          const reStart = async () => {
            _data = await this.$fetch.post(
              this.$api.baseUrl + this.$api.training.addQuiz,
              {
                param: {
                  caseId: id,
                  user_id: _userId,
                  moduleType: this.targetModuleId.id,
                  user_select_caseCategoryKey: categoryKey
                }
              }
            )

            this.$store.commit('saveStartExamData', _data)
            uni.navigateTo({
              url: `../trainingOrExam/trainingOrExam`
            })
          }

          let _data = this.$decryption(res.data).data
          let _array = ['继续训练', '重新开始']
          if (uni.getSystemInfoSync().platform === 'android') {
            _array.push('取消')
          }
          if (_data.quizType !== 0) {
            uni.showActionSheet({
              itemList: _array,
              success: res => {
                if (res.tapIndex === 1) {
                  reStart()
                } else {
                  this.$store.commit('saveStartExamData', _data)
                  uni.navigateTo({
                    url: `../trainingOrExam/trainingOrExam`
                  })
                }
              }
            })
          } else {
            reStart()
          }
        },
        fail: () => {
          console.warn(`---------开始练习发生错误`)
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.menuList = null
    this.canClick = null
    this.caseData = null
    this.targetModuleId = null
    this.targetDivision = null
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0;
}
.case-list {
  text-align: center;
  margin-top: 15upx;
  padding-bottom: 40upx;
  $lh: 60upx;
  .case {
    background-color: #fff;
    padding: 20upx;
    border-radius: 16upx;
    margin: 0 $ty-content-padding 16upx $ty-content-padding;
    text-align: left;
    .name {
      font-weight: bold;
      font-size: $uni-font-size-lg;
    }
    .info {
      display: flex;
    }
    .division {
      background-color: $uni-border-color;
      border-radius: 100px;
      text-align: center;
      padding: 0 30upx;
      line-height: $lh;
      height: $lh;
      // flex: 1;
    }
    .score {
      flex: 2;
      color: $uni-text-color-warning;
      text-align: right;
      font-size: $uni-font-size-lg;
      margin-right: 40upx;
    }
    .primary {
      background-color: $uni-color-success;
      font-size: $uni-font-size-lg;
      border-radius: 100px;
      width: 200upx;
      height: $lh;
      line-height: $lh;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
