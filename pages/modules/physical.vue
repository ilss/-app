<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 体格检查 模块
-->
<template>
  <view class="fixed-bottom">
    <ty-data-loading v-if="showLoading"></ty-data-loading>
    <view v-if="!showLoading">
      <view class="data-error no-data" v-if="!physicalCheckClassify">
        <view class="btn-primary" @tap="initData">重新加载数据</view>
      </view>
      <!-- 体格检查 -->
      <!-- <jumpBall :start="num" :event="clickEvent"></jumpBall> -->

      <!-- <view class="view-mask" v-show="showMask"></view> -->
      <bottom-panel
        :answerNum="computedAnswerNum"
        :progress="computedAnswerProgress"
        @handler="openPop"
      ></bottom-panel>

      <!-- //默认全显示 -->
      <view class="animated fadeIn">
        <uni-collapse accordion="true">
          <uni-collapse-item
            v-for="(inquiryCategorie, index) in physicalCheckClassify"
            :key="index"
            v-if="inquiryCategorie.children.length > 0"
            :iconClass="filterIconClass(inquiryCategorie.name)"
            iconStyle="font-size:24px;padding-right:20upx;color:#0B1D51;"
            :title="
              inquiryCategorie.name +
                ' (' +
                inquiryCategorie.children.length +
                ')'
            "
          >
            <view
              v-for="(explain, index) in inquiryCategorie.children"
              :key="index"
              :class="[
                'popup-list-item physical-item',
                explain.disabled ? 'disabled' : ''
              ]"
              @tap="answerHandler($event, explain)"
            >
              <label class="label">
                <checkbox
                  class="checkbox"
                  value="1"
                  :checked="explain.disabled"
                  :disabled="explain.disabled || disabledAll"
                />
                <text>{{ explain.explainName }}</text>
              </label>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
    </view>
    <popup-layer ref="popupHistoryTaking" :direction="'top'">
      <view class="popup-exam-history">
        <view class="uni-flex pop-title" v-once>
          <view class="title popupHistoryTakingBall">检查记录</view>
          <view class="iconfont iconguanbi" @tap="closePop()"></view>
        </view>
        <view class="cont">
          <ty-list-no-data
            :canShow="answerPopData.length < 1"
            text="暂无检查记录"
          ></ty-list-no-data>
          <view
            v-for="(item, index) in answerPopData"
            :key="index"
            class="popup-list-item uni-flex"
          >
            <view class="uni-flex-item" @tap.stop="openPopupResult(item)">
              {{ item.explainName }}
            </view>
            <view class="iconfont icongengduo"></view>
          </view>
        </view>
      </view>
    </popup-layer>

    <popup-layer ref="popupResult" :direction="'top'">
      <view class="popup-exam-history" style="background-color: #FFF;">
        <view class="uni-flex pop-title">
          <view class="title popupHistoryTakingBall">
            检查结果-{{ popData.title }}
          </view>
          <view
            class="iconfont iconguanbi"
            @tap="closePopupResult()"
            v-once
          ></view>
        </view>

        <view class="result" v-if="!popData.type">{{ popData.result }}</view>
        <!-- <iframe src="hybrid/html/viewer/phycheckResult/toucheyes.html?&para=0" /> -->
        <!-- 图片 -->
        <view
          class="result"
          v-if="popData.type === 'png' || popData.type === 'jpg'"
        >
          <image
            v-for="(img, index) in popData.resourcesUrl"
            :key="index"
            :src="img"
            mode="widthFix"
            style="width: 100%;"
          ></image>
        </view>

        <!-- mp3 -->
        <view class="result" v-if="popData.type === 'mp3'">
          <tyAudioPlayer
            v-if="canShowVideoPlayer"
            v-for="(audio, index) in popData.resourcesUrl"
            :key="index"
            :vpId="popData.id"
            :url="audio"
          ></tyAudioPlayer>
        </view>
        <!-- mp4 -->
        <view class="video-player" v-if="popData.type === 'mp4'">
          <video
            v-if="canShowVideoPlayer"
            style="width: 100%;"
            direction="0"
            controls="true"
            v-for="(video, index) in popData.resourcesUrl"
            :key="index"
            :src="video"
          ></video>
        </view>
        <!-- http://114.116.110.224:3005/producerResource/64/649c3c3bc743da2e5aa06966827fe4bf.mp4 -->
        <view class="cont">
          <view class="result">
            <view v-for="(item1, index1) in popData.explainItems" :key="index1">
              <view v-if="item1.type !== 0">{{ item1.name }}请作答：</view>
              <radio-group
                v-if="item1.type === 2"
                :data-physicalcheckid="popData.id"
                :data-physicalcheckexplainitemid="item1.id"
                @change="radioChange"
              >
                <label
                  v-for="(explainAnswer, idx) in item1.explainAnswerItems"
                  :key="idx"
                  style="display: block;"
                >
                  <radio
                    :value="explainAnswer.id"
                    :checked="isChecked(popData.id, item1.id, explainAnswer.id)"
                  />
                  {{ explainAnswer.name }}
                </label>
              </radio-group>
            </view>
          </view>
        </view>
      </view>
    </popup-layer>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
// import { ModuleTypeClass } from '../../api/api.js'
// import jumpBall from '@/components/hx-jump-ball/hx-jump-ball.vue'
import { uniSegmentedControl } from '@dcloudio/uni-ui'
import uniCollapse from '@/components/@tellyes-vue/ty-collapse/ty-collapse.vue'
import uniCollapseItem from '@/components/@tellyes-vue/ty-collapse-item/ty-collapse-item.vue'
import bottomPanel from './components/bottom-panel.vue'
import tyAudioPlayer from '@/components/@tellyes-vue/ty-audio-player/ty-audio-player.vue'
// 是否可以继续作答
let canAnser = true
const iconCofig = [
  {
    title: '生命体征',
    icon: 'iconshengmingtizheng'
  },
  {
    title: '一般情况查体',
    icon: 'iconyibanqingkuangchati'
  },
  {
    title: '淋巴结',
    icon: 'iconlinbajie'
  },
  {
    title: '头部',
    icon: 'icontoubu'
  },
  {
    title: '颈部',
    icon: 'iconjingbu1'
  },
  {
    title: '胸部',
    icon: 'iconxiongbu'
  },
  {
    title: '腹部',
    icon: 'iconfubu'
  },
  {
    title: '生殖器',
    icon: 'iconzhichang'
  },
  {
    title: '四肢',
    icon: 'iconsizhi'
  },
  {
    title: '神经系统',
    icon: 'iconshenjingxitong'
  },
  {
    title: '产科检查',
    icon: 'iconchanke'
  },
  {
    title: '其他神经系统检查',
    icon: 'iconshenjingxitong'
  }
]
export default {
  components: {
    // jumpBall,
    uniSegmentedControl,
    uniCollapse,
    uniCollapseItem,
    bottomPanel,
    tyAudioPlayer
  },
  props: {
    // methondId: {
    //   type: Number,
    //   default: ModuleTypeClass.physicalCheck.id //如果为体格单项  单项中需要处理 做答题
    // },
    activeTabs: {
      type: Number,
      default: 1 //是否显示遮盖层
    },
    //学生答题数据 physicalCheckAnswers
    studentAnswerData: {
      type: Array,
      default() {
        return []
      }
    },
    //学生答题数据 physicalCheckExplainAnswers
    studentAnswerExplainData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showLoading: true,
      showMask: false,
      canShowVideoPlayer: false,
      // 抛物线动画终点
      // num: 0,
      // clickEvent: null,
      answerPopData: [],
      answerProgress: 100, //答题百分比进度条
      physicalCheckClassify: [],
      maxCount: 0,
      // trainId: '',
      disabledAll: false, //禁用所有 多选框
      // physicalModuleId: null,
      popData: {} // popup 显示当前检测结果
      //  studentAnswerData: this.$store.getters.get studentAnswerData
    }
  },
  computed: {
    // ...mapState(['meExamDataArray', 'serverTime']),
    computedAnswerNum() {
      let _studentAnswer = 0
      try {
        _studentAnswer = this.answerPopData.length
        let _num = this.maxCount - _studentAnswer
        if (_num <= 0) {
          this.disabledAll = true
          canAnser = false
          _num = 0
        }
        return _num
      } catch (e) {
        console.warn(e)
      }
    },
    computedAnswerProgress() {
      let _studentAnswer = 0
      try {
        _studentAnswer = this.answerPopData.length
        const count = this.maxCount
        const progress = parseInt(((count - _studentAnswer) / count) * 100)
        return progress || 0
      } catch (e) {
        console.warn(e)
      }
    }
  },
  watch: {
    tempAnswer: 'saveAnswer',
    activeTabs: 'updateChatBubble'
  },
  mounted() {
    // this.physicalModuleId = Object.freeze(ModuleTypeClass.physicalCheck.id)
    this.initData()
  },
  methods: {
    initData() {
      this.showLoading = true
      canAnser = true
      let t = setTimeout(() => {
        this.getCaseInquiry()
        clearTimeout(t)
        t = null
      }, 510)
    },
    initAnswerPopData() {
      this.physicalCheckClassify.forEach(inquiryCategorie => {
        inquiryCategorie.children.forEach(item => {
          if (this.answerIsExist(item.id)) {
            item.disabled = true
            this.answerPopData.push(item)
          }
        })
      })
    },
    answerIsExist(id) {
      return this.studentAnswerData.some(
        answer => answer.physicalCheckId === id
      )
    },
    openPop() {
      this.$refs.popupHistoryTaking.show()
    },
    closePop() {
      this.$refs.popupHistoryTaking.close()
    },
    openPopupResult(obj) {
      console.log(obj)
      this.popData = {
        id: obj.id,
        title: obj.explainName
      }
      // 处理 检查结果 所需数据  过滤出 mp4 和 mp3，其他的直接显示 result
      if (
        obj.resources &&
        ['mp4', 'mp3', 'png', 'jpg'].findIndex(
          item => item === obj.resources[0].type
        ) > -1
      ) {
        this.popData.type = obj.resources[0].type
        this.popData.explainName = obj.explainName
        this.popData.resourcesUrl = []
        obj.resources.forEach(video => {
          this.popData.resourcesUrl.push(
            this.$api.options.innerResource +
              video.directory +
              '/' +
              video.md5 +
              '.' +
              video.type
          )
        })
        // console.log(this.popData.resourcesUrl)
        this.popData.explainItems = obj.explainItems
        if (
          obj.resources[0].type === 'mp4' ||
          obj.resources[0].type === 'mp3'
        ) {
          let t = setTimeout(() => {
            this.canShowVideoPlayer = true
            clearTimeout(t)
            t = null
          }, 400)
        }
      } else {
        this.popData.result = obj.result
      }
      this.$refs.popupResult.show()
    },
    closePopupResult() {
      this.canShowVideoPlayer = false
      this.$refs.popupResult.close()
    },
    filterIconClass(name) {
      const _icon = iconCofig.find(item => {
        return name.indexOf(item.title) > -1
      })
      if (_icon) {
        return _icon.icon
      }
    },
    /**
     * 获取问诊题库
     */
    async getCaseInquiry() {
      const _inquiryData = await this.$fetch.post(
        this.$api.baseUrl + this.$api.cases.getPhysicalCheckData,
        {
          param: {
            caseId: this.$store.getters.getTargetCaseId,
            user_select_caseCategoryKey: this.$store.getters.userParam
              .user_select_caseCategoryKey
          }
        }
      )
      if (!_inquiryData) {
        this.physicalCheckClassify = false
        this.showLoading = false
        return false
      }
      this.physicalCheck = _inquiryData
      this.maxCount = _inquiryData.maxCount || 0

      //提取 physicalCheckCategories 的相关数据
      this.physicalCheckClassify = []
      this.processPhysicalCheckCategories(_inquiryData)
      this.processPositionsData(_inquiryData)
      this.physicalCheckClassify = Object.freeze(this.physicalCheckClassify)
      this.initAnswerPopData()
      this.showLoading = false
    },
    processPhysicalCheckCategories(inquiryData) {
      inquiryData.physicalCheckCategories.map(categorie => {
        let _array = inquiryData.physicalChecks.filter(physicalCheck => {
          return physicalCheck.physicalCheckCategoryId === categorie.id
        })
        this.physicalCheckClassify.push({
          id: categorie.id,
          name: categorie.name,
          type: 'other',
          modelPosition: 0,
          resource: null,
          children: _array
        })
      })
    },
    isChecked(physicalcheckid, physicalCheckExplainItemId, explainAnswerId) {
      let _isExist = false
      if (this.studentAnswerExplainData.length > 0) {
        for (
          let i = 0, len = this.studentAnswerExplainData.length;
          i < len;
          i++
        ) {
          const _explain = this.studentAnswerExplainData[i]
          if (_explain.physicalCheckId === physicalcheckid) {
            _explain.explainItemAnswers.forEach(item => {
              if (
                !item.isDeleted &&
                item.physicalCheckExplainItemId ===
                  physicalCheckExplainItemId &&
                item.explainAnswer === explainAnswerId
              ) {
                _isExist = true
              }
            })
          }
        }
      }
      return _isExist
    },
    radioChange(e) {
      const _id = e.detail.value,
        _physicalCheckId = e.target.dataset.physicalcheckid,
        _physicalCheckExplainItemId =
          e.target.dataset.physicalcheckexplainitemid

      this.updateAnswerExplainData(
        _physicalCheckId,
        _physicalCheckExplainItemId,
        _id
      )
    },
    updateAnswerExplainData(physicalCheckId, physicalCheckExplainItemId, data) {
      const _res = {
        physicalCheckExplainItemId: physicalCheckExplainItemId,
        explainAnswer: data,
        addTime: this.$root.gmtToStr(Date.now()),
        isDeleted: false
      }
      let _isExist = false
      //看是否已存在此题的答案 如存在 isDeleted 置为 true
      if (this.studentAnswerExplainData.length > 0) {
        for (
          let i = 0, len = this.studentAnswerExplainData.length;
          i < len;
          i++
        ) {
          const _explain = this.studentAnswerExplainData[i]
          if (_explain.physicalCheckId === physicalCheckId) {
            _isExist = true
            _explain.explainItemAnswers.forEach(item => {
              if (
                item.physicalCheckExplainItemId === physicalCheckExplainItemId
              ) {
                item.isDeleted = true
                item.deleteTime = this.$root.gmtToStr(Date.now())
              }
            })

            _explain.explainItemAnswers.push(_res)
          }
        }
      }

      // 新题 直接保存本数据
      if (!_isExist) {
        this.studentAnswerExplainData.push({
          physicalCheckId: physicalCheckId,
          explainItemAnswers: [_res]
        })
      }
      this.$root.saveAnswer({
        physicalCheckExplainAnswers: this.studentAnswerExplainData
      })
    },
    /**
     * 处理位置数据
     * @param {Object} inquiryData
     */
    processPositionsData(inquiryData) {
      inquiryData.positions.map(pos => {
        let _array = {
          id: pos.id,
          name: pos.name,
          type: 'position',
          modelPosition: 0,
          resource: null,
          children: []
        }
        pos.children.map(position => {
          let _arrayChildren = inquiryData.physicalChecks.filter(
            physicalCheck => {
              return physicalCheck.positionId === position.id
            }
          )
          _array.children = [..._array.children, ..._arrayChildren]
        })
        this.physicalCheckClassify.push(_array)
      })
    },
    // 保存答案
    answerHandler(e, obj) {
      if (!canAnser) {
        uni.showToast({
          icon: 'none',
          title: '答题次数已用尽'
        })
        return
      }
      // console.log(obj)
      if (this.answerIsExist(obj.id)) {
        uni.showToast({
          icon: 'none',
          title: '此检查项已做过'
        })
        return
      }
      // 小球动画
      // this.clickEvent = e.detail
      // this.num++
      // this.showMask = true
      obj.disabled = true
      // setTimeout(() => {
      //   this.showMask = false
      // }, 800)

      let _inquiryAnswer = this.studentAnswerData
      const _inquiryObj = {
        physicalCheckId: obj.id,
        order: _inquiryAnswer.length + 1,
        time: this.$root.gmtToStr(Date.now())
      }
      _inquiryAnswer.push(_inquiryObj)
      this.answerPopData.push(obj)
      //问诊数量+1
      this.$root.saveAnswer({
        physicalCheckAnswers: _inquiryAnswer
      })

      // 如果有做答题 非视频的  直接 添加答案
      if (!obj.explainItems) return
      for (let i = 0, len = obj.explainItems.length; i < len; i++) {
        const _explainItems = obj.explainItems[i],
          _resource = obj.resources ? obj.resources[i] : {}

        if (_explainItems.type === 2 && _resource.parameters) {
          const parameters = _resource.parameters
          this.updateAnswerExplainData(
            obj.id,
            _explainItems.id,
            _explainItems.explainAnswerItems[parameters[i].value].id
          )
        } else {
          if (obj.resources && _resource && _resource.parameters) {
            const parameters = _resource.parameters
            this.updateAnswerExplainData(
              obj.id,
              _explainItems.id,
              parameters[i].value + ''
            )
          } else {
            this.updateAnswerExplainData(obj.id, _explainItems.id, obj.result)
          }
        }
      }
    }
  },
  beforeDestroy() {
    this.showLoading = null
    this.showMask = null
    // this.num = null
    // this.clickEvent = null
    this.answerPopData = null
    this.answerProgress = null
    this.physicalCheckClassify = null
    this.maxCount = null
    // this.trainId = null
    canAnser = null
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/popupExamHistory.scss';
.btn-check {
  font-size: $uni-font-size-sm;
}
.physical-item {
  // background-color: $uni-bg-color-grey;
  border-bottom: none;
  border-top: 1px solid $uni-border-color;
}
.disabled {
  opacity: 0.5;
}
.result {
  padding: 30upx $ty-content-padding;

  label {
    padding: 10upx 0;
  }
}
</style>
