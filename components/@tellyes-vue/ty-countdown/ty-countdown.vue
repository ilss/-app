<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 倒计时组件
-->
<template>
  <view class="ty-countdown">
    <view
      v-if="showDay"
      class="ty-countdown__number"
      :style="{
        borderColor: borderColor,
        color: color,
        background: backgroundColor
      }"
    >
      {{ d }}
    </view>
    <view
      v-if="showDay"
      class="ty-countdown__splitor"
      :style="{ color: splitorColor }"
    >
      天
    </view>
    <view
      class="ty-countdown__number"
      :style="{
        borderColor: borderColor,
        color: color,
        background: backgroundColor
      }"
    >
      {{ h }}
    </view>
    <view class="ty-countdown__splitor" :style="{ color: splitorColor }">
      {{ showColon ? ':' : '时' }}
    </view>
    <view
      class="ty-countdown__number"
      :style="{
        borderColor: borderColor,
        color: color,
        background: backgroundColor
      }"
    >
      {{ i }}
    </view>
    <view class="ty-countdown__splitor" :style="{ color: splitorColor }">
      {{ showColon ? ':' : '分' }}
    </view>
    <view
      class="ty-countdown__number"
      :style="{
        borderColor: borderColor,
        color: color,
        background: backgroundColor
      }"
    >
      {{ s }}
    </view>
    <view
      v-if="!showColon"
      class="ty-countdown__splitor"
      :style="{ color: splitorColor }"
    >
      秒
    </view>
  </view>
</template>
<script>
let startTime,
  count = 0
export default {
  name: 'ty-countdown',
  props: {
    showDay: {
      type: Boolean,
      default: true
    },
    showColon: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    borderColor: {
      type: String,
      default: '#000000'
    },
    color: {
      type: String,
      value: '#000000'
    },
    splitorColor: {
      type: String,
      default: '#fff'
    },
    day: {
      type: Number,
      default: 0
    },
    hour: {
      type: Number,
      default: 0
    },
    minute: {
      type: Number,
      default: 0
    },
    second: {
      type: Number,
      default: 0
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      d: '00',
      h: '00',
      i: '00',
      s: '00',
      leftTime: 0,
      seconds: 0
    }
  },
  watch: {
    reset(val) {
      clearTimeout(this.timer)
      this.startData()
    }
  },
  created: function(e) {
    this.startData()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
    this.d = null
    this.h = null
    this.i = null
    this.s = null
    this.leftTime = null
    this.seconds = null
    startTime = null
    count = null
  },
  methods: {
    startData() {
      this.seconds = this.toSeconds(
        this.day,
        this.hour,
        this.minute,
        this.second
      )
      if (this.seconds <= 0) {
        clearTimeout(this.timer)
        return
      }
      startTime = new Date().getTime()
      this.countDown()

      let fixed = () => {
        this.seconds--
        clearTimeout(this.timer)
        if (this.seconds < 0) {
          this.timeUp()
          return
        }
        this.countDown()
        count++
        var offset = new Date().getTime() - (startTime + count * 1000)
        var nextTime = 1000 - offset
        if (nextTime < 0) nextTime = 0
        console.log(offset)
        this.timer = setTimeout(fixed, nextTime)
      }
      this.timer = setTimeout(fixed, 1000)

      // this.timer = setInterval(() => {
      //   this.seconds--
      //   if (this.seconds < 0) {
      //     this.timeUp()
      //     return
      //   }
      //   this.countDown()
      // }, 1000)
    },
    toSeconds(day, hours, minutes, seconds) {
      return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds
    },
    timeUp() {
      // clearInterval(this.timer)
      this.$emit('timeup')
    },
    countDown() {
      let { seconds } = this
      let [day, hour, minute, second] = [0, 0, 0, 0]
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24))
        hour = Math.floor(seconds / (60 * 60)) - day * 24
        minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60
        second =
          Math.floor(seconds) -
          day * 24 * 60 * 60 -
          hour * 60 * 60 -
          minute * 60
      } else {
        this.timeUp()
      }
      if (day < 10) {
        day = '0' + day
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      this.d = day
      this.h = hour
      this.i = minute
      this.s = second
    }
  }
}
</script>
<style lang="scss" scoped>
$countdown-height: 44upx;

.ty-countdown {
  padding: 2upx 0;
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;

  &__splitor {
    justify-content: center;
    line-height: $countdown-height;
    padding: 0 5upx;
    font-size: $uni-font-size-base;
  }

  &__number {
    line-height: $countdown-height;
    justify-content: center;
    height: $countdown-height;
    border-radius: $uni-border-radius-base;
    margin: 0 5upx;
    font-size: $uni-font-size-base + 4;
    border: 1px solid #000000;
    padding: 0 10upx;
  }
}
</style>
