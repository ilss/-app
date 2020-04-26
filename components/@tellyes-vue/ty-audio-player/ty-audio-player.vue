<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 音频播放组件
-->
<template>
  <view>
    <view class="player-cont">
      <view class="slider-box">
        <text class="mm">{{ timer }}</text>
        <slider
          style="width: 80%;"
          class="audio-slider"
          block-size="0"
          :min="0"
          :max="duration"
          :value="currentTime"
          activeColor="#ff7400"
        />
        <text class="ss">{{ overTimer }}</text>
      </view>
      <view class="controller">
        <view
          class="iconfont iconbofang1"
          @tap="play()"
          v-show="playState === 1"
        ></view>
        <view
          class="iconfont iconbofang"
          @tap="pause()"
          v-show="playState === 0"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
let bgAudioMannager
export default {
  props: {
    url: ''
  },
  data() {
    return {
      isStart: false,
      playState: 1, // 0暂停 1播放
      currentTime: 0, //当前进度
      duration: 100 // 总进度
    }
  },
  computed: {
    timer() {
      return calcTimer(this.currentTime)
    },
    overTimer() {
      return calcTimer(this.duration)
    }
  },
  mounted() {
    // 不支持H5
    bgAudioMannager = uni.getBackgroundAudioManager()
    this.bgAudioInnit()
  },
  methods: {
    bgAudioInnit() {
      bgAudioMannager.src = this.url
      bgAudioMannager.onPlay(() => {
        this.playFunc()
      })
      bgAudioMannager.onPause(() => {
        this.pauseFunc()
      })
      bgAudioMannager.onTimeUpdate(() => {
        this.currentTime = Math.floor(bgAudioMannager.currentTime)
      })

      bgAudioMannager.onError(() => {
        this.error()
      })
      // bgAudioMannager.onWaiting(function() {
      // 	this.playState = 0
      // })

      bgAudioMannager.onCanplay(function() {
        this.duration = Math.floor(bgAudioMannager.duration)
      })

      bgAudioMannager.pause()
    },
    error() {
      this.playState = 1
    },
    play() {
      bgAudioMannager.play()
    },
    pause() {
      bgAudioMannager.pause()
    },
    playFunc() {
      this.isStart = true
      this.playState = 0
    },
    pauseFunc() {
      this.playState = 1
    }
  },
  beforeDestroy() {
    bgAudioMannager.stop()
    this.status = null
    this.currentTime = null
    this.duration = null
    bgAudioMannager.src = undefined
    bgAudioMannager = null
  }
}

function calcTimer(timer) {
  if (timer === 0 || typeof timer !== 'number') {
    return '00:00'
  }
  let mm = Math.floor(timer / 60)
  let ss = Math.floor(timer % 60)
  if (mm < 10) {
    mm = '0' + mm
  }
  if (ss < 10) {
    ss = '0' + ss
  }
  return mm + ':' + ss
}
</script>

<style lang="scss" scoped>
.audo-video {
  padding-bottom: 20upx;
  background-color: #000;
}

.slider-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26upx;
  color: #999;
  margin-left: 28upx;
  flex: 1;
}

button {
  display: inline-block;
  width: 100upx;
  background-color: #fff;
  font-size: 24upx;
  color: #000;
  padding: 0;
}

.hidden {
  position: fixed;
  z-index: -1;
  width: 1upx;
  height: 1upx;
}

.waveform {
  width: 100%;
  height: 100upx;
}

.player-cont {
  display: flex;
  background-color: #333;
  border-radius: 20upx;

  .controller {
    width: 100upx;
    text-align: right;

    .iconfont {
      font-size: 40upx;
      padding: 5upx 20upx;
      color: #f2f2f2;
    }
  }
}
</style>
