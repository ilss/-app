<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 问诊聊天气泡组件
-->
<template>
  <scroll-view
    id="scrollview"
    class="ty-chatBubble-view"
    scroll-y="true"
    :scroll-top="scrollTop"
    :scroll-with-animation="true"
    :style="'height:' + (multiLine ? '92%' : '220upx')"
  >
    <view
      class="bubble"
      v-if="showData.length > 0"
      v-for="(obj, index) of showData"
      :key="index"
    >
      <!-- :class="index === initData.length - 1 ? 'new' : ''" -->
      <view class="ask">
        <view class="cont">{{ obj.question || '' }}</view>
      </view>
      <view class="answer">
        {{ inputOk ? obj.answer : '对方正在输入...' }}
      </view>
    </view>
    <!-- <view v-if="multiLine"></view> -->
  </scroll-view>
</template>

<script>
export default {
  props: {
    myStyle: { type: String, default: '' },
    multiLine: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Array,
      default() {
        return []
      }
    },
    viewHeight: {
      type: Number,
      default: 300
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      inputOk: false,
      showData: [],
      style: {
        pageHeight: 0,
        contentViewHeight: 0,
        footViewHeight: 90,
        mitemHeight: 0
      },
      scrollTop: 0
    }
  },
  watch: {
    initData: 'updateView'
  },
  computed: {},
  mounted() {
    const res = uni.getSystemInfoSync() //获取手机可使用窗口高度     api为获取系统信息同步接口
    this.style.pageHeight = res.windowHeight
    this.style.contentViewHeight =
      res.windowHeight -
      (uni.getSystemInfoSync().screenWidth / 750) * 100 //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下
    this.inputOk = true
  },
  methods: {
    updateView() {
      this.inputOk = false
      this.showData = this.multiLine
        ? [...this.initData]
        : [this.initData[this.initData.length - 1]]
      if (this.multiLine) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }

      let timer = setInterval(() => {
        this.inputOk = true
        if (this.multiLine) {
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
        clearInterval(timer)
        timer = null
      }, 1000)
    },
    scrollToBottom: function() {
      let _this = this
      let query = uni.createSelectorQuery().in(this)
      query.selectAll('.bubble').boundingClientRect()
      query.select('#scrollview').boundingClientRect()
      query.exec(res => {
        _this.style.mitemHeight = 0
        res[0].forEach(
          rect =>
            (_this.style.mitemHeight =
              _this.style.mitemHeight + rect.height + 200)
        ) //获取所有内部子元素的高度
        this.$nextTick(() => {
          if (
            _this.style.mitemHeight >
            _this.style.contentViewHeight
          ) {
            //判断子元素高度是否大于显示高度
            _this.scrollTop =
              _this.style.mitemHeight -
              _this.style.contentViewHeight //用子元素的高度减去显示的高度就获益获得序言滚动的高度
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.ty-chatBubble-view {
  overflow: scroll;
  background-color: $uni-bg-color-grey;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  .new {
    background-color: #d5e3ff;
  }
  .bubble {
    $angle: 90deg;
    padding: 20upx 0;

    .answer:after,
    .cont:after {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      top: 10upx;
      right: -17upx;
      border: solid 25upx;
      transform: rotate($angle);
      -ms-transform: rotate($angle); /* IE 9 */
      -moz-transform: rotate($angle); /* Firefox */
      -webkit-transform: rotate(
        $angle
      ); /* Safari and Chrome */
      -o-transform: rotate($angle); /* Opera */
      border-color: transparent transparent transparent
        $uni-color-warning;
      font-size: 0;
    }
    .ask {
      overflow: hidden;
      .cont {
        float: right;
        display: inline-block;
        position: relative;
        padding: 10upx 20upx;
        max-width: 80%;
        margin-right: 20upx;
        background-color: $uni-color-warning;
        border-radius: 40upx;
        color: #fff;
        &:after {
          right: -17upx;
        }
      }
    }
    .answer {
      $bgColor: #fff;
      display: inline-block;
      position: relative;
      padding: 10upx 20upx;
      max-width: 80%;
      margin: 10upx 0 0 20upx;
      background-color: $bgColor;
      border-radius: 40upx;
      color: $uni-color-primary;
      &:after {
        left: -18upx;
        border-color: transparent transparent transparent
          $bgColor;
      }
    }
  }
}
</style>
