<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 主屏
-->
<template>
  <view class="content">
    <!--    <ty-nav-bar backState="2000" type="fixed" title="我的">
        <view class="iconfont iconwode nav-bar-btn" slot="right" @tap="gotoUser"></view>
    </ty-nav-bar> -->
    <ty-data-loading v-if="showLoading" myClass="mask-layer"></ty-data-loading>
    <view>
      <view class="main-enter">
        <view
          class="enter-nav exam"
          :class="showEnter ? 'animated flipInX' : 'hidden'"
          @tap="openExamCode"
        >
          <view class="note">考试现场答题考核</view>
          <view class="title">考试</view>
          <view class="en">Examination</view>
        </view>

        <view
          class="enter-nav training"
          :class="showEnter ? 'animated flipInX' : 'hidden'"
          @tap="goPractice"
        >
          <view class="note">日常联系提升专业水平</view>
          <view class="title">练习</view>
          <view class="en">Training</view>
        </view>
      </view>
      <popup-layer ref="popupRef" :direction="'top'">
        <view class="ty-valid-code-view">
          <view
            class="iconfont iconziyuan"
            style="float: left; font-size: 52upx; margin-left: 30upx; color: #0B1D51;"
            @tap="openScan"
          ></view>
          <view class="iconfont iconguanbi" @tap="closePop"></view>
          <view class="title">考试验证码</view>
          <view data-scindex="0">
            <view class="content">
              <ty-keyboard-number
                ref="code"
                @confirm="enterExamHandler"
              ></ty-keyboard-number>
            </view>
          </view>
          <!-- <view class="cont"><ty-validCode ref="code" @finish="enterExam"></ty-validCode></view>
					<view class="note">
						验证码由教师发放
					</view> -->
        </view>
      </popup-layer>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import tyKeyboardNumber from '@/components/@tellyes-vue/ty-keyboard-number/ty-keyboard-number.vue'
export default {
  data() {
    return {
      canClick: true,
      showLoading: false,
      showEnter: false
    }
  },
  components: { tyKeyboardNumber },
  computed: mapState(['scanResult']),
  watch: {
    // #ifdef APP-PLUS
    scanResult(val) {
      if (val.length === 4) {
        this.enterExamHandler(parseInt(val))
      }
    }
    // #endif
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: this.$api.options.appName
    })
  },
  onNavigationBarButtonTap() {
    this.gotoUser()
  },
  mounted() {
    let t = setTimeout(() => {
      this.showEnter = true
      this.$store.commit('clearTargetExamData')
      clearTimeout(t)
    }, 300)
  },
  methods: {
    gotoUser() {
      uni.navigateTo({
        url: '../user/user'
      })
    },
    openExamCode() {
      this.$refs.code.clear()
      this.$refs.popupRef.show()
    },
    closePop() {
      this.$refs.popupRef.close()
    },
    openScan() {
      uni.navigateTo({
        url: '../scan/scan'
      })
      let t = setTimeout(() => {
        this.closePop()
        clearTimeout(t)
        t = null
      }, 500)
    },
    goPractice() {
      if (this.canClick) {
        this.canClick = false
        let t = setTimeout(() => {
          this.canClick = true
          clearTimeout(t)
          t = null
        }, 1000)

        if (this.$api.caseClass.category.length < 1) {
          uni.showToast({
            icon: 'none',
            title: '没有可以训练的病例'
          })
          return
        }
        uni.navigateTo({
          url: '../practice/practice'
        })
      }
    },
    enterExamHandler(code) {
      this.$tyDebounce({
        key: 'enterExamHandler',
        time: 3000,
        success: () => {
          this.enterExam(code)
        }
      })
    },
    enterExam(code) {
      // // #ifdef APP-PLUS
      // plus.key.hideSoftKeybord();
      // // #endif
      this.showLoading = true
      const gotoExamInfo = () => {
        let t = setTimeout(() => {
            uni.navigateTo({
              url: '../examination/examInfo'
            })
            clearTimeout(t)
            t = null
          }, 150),
          t2 = setTimeout(() => {
            this.showLoading = false
            this.closePop()
            clearTimeout(t2)
            t2 = null
          }, 100)
      }

      const errorFunc = txt => {
        uni.showToast({
          icon: 'none',
          title: txt + ''
        })
        this.showLoading = false
      }

      this.$store.commit('setTargetExamInfo', null)
      const { userParam } = this.$store.getters

      this.$fetch
        .post(this.$api.baseUrl + this.$api.exams.enterExam, {
          param: {
            code: code,
            user_id: userParam.user_id
          }
        })
        .then(res => {
          console.log(res)
          if (!res) {
            uni.showToast({
              icon: 'none',
              title: '服务器无响应'
            })
            this.showLoading = false
          }
          const { data } = res
          if (res.success) {
            // 考务信息
            this.$store.commit('setTargetExamInfo', data)
            gotoExamInfo()
          } else {
            errorFunc(res.msg)
          }
        })
    }
  },
  beforeDestroy() {
    this.canClick = null
    this.showLoading = null
    this.showEnter = null
  }
}
</script>

<style lang="scss" scoped>
@import '~static/css/main.scss';
</style>
