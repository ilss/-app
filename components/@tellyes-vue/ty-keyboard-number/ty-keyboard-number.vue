<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 数字小键盘组件
-->
<template>
  <view class="box">
    <view class="box__header"><slot></slot></view>
    <view class="box__body">
      <view class="password-box">
        <view class="password-item" @tap="show">
          <view class="password-item-char" v-for="i in items" :key="i">
            <view
              class="password-item-char__dot"
              v-if="password[i] || password[i] === 0"
            >
              {{ password[i] }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view :class="'keyboard ' + pattern">
      <ul class="number">
        <li class="button" @tap="input(item)" v-for="item in keys" :key="item">
          {{ item }}
        </li>
        <li class="button action"><view class="delete" @tap="del"></view></li>
        <li class="button" @tap="input(0)">0</li>
        <li class="button action btn-enter">
          <view @tap="done">进入考试</view>
        </li>
      </ul>
      <!--<view class="action">
				 <view class="delete" @tap="del"></view>
				<view class="ok" @tap="done"></view> 
			</view>-->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    defaultPassword: String,
    keyNeedRandom: {
      type: Boolean,
      default: false
    },
    showHideBtn: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      items: [0, 1, 2, 3],
      password: [],
      keys: [],
      pattern: 'hidden'
    }
  },
  mounted() {
    this.keys = this.processKeys()
  },
  methods: {
    processKeys() {
      let natural = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      if (!this.keyNeedRandom) {
        return natural
      }
      return natural.sort(function() {
        return Math.random() > 0.5 ? -1 : 1 //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
      })
    },
    show() {
      if (!this.showHideBtn) {
        return
      }
      let args = {
        cancel: false
      }
      this.$emit('shown', args)
      if (!args.cancel) {
        this.pattern = 'slideup'
      }
    },
    clear() {
      this.password = []
    },
    hide() {
      let args = {
        cancel: false
      }
      this.$emit('hidden', args)
      if (!args.cancel) {
        this.pattern = 'slidedown'
      }
    },
    input(item) {
      let args = {
        target: this,
        data: item,
        cancel: false,
        callback: undefined
      }
      this.$emit('input', args)
      if (!args.cancel && this.password.length < this.items.length) {
        if (args.callback && typeof args.callback === 'function') {
          args.callback.call(this)
        }
        this.password.push(item)
      }
    },
    del() {
      let args = {
        cancel: false
      }
      this.$emit('delete', args)
      if (!args.cancel) {
        if (this.password.length > 0) {
          this.password = this.password.slice(0, this.password.length - 1)
        }
      }
    },
    done() {
      if (this.password.length !== this.items.length) return
      this.$emit('confirm', this.password.join(''))
    }
  },
  watch: {
    defaultPassword: {
      immediate: true,
      handler(val) {
        if (val && val.length === 6) {
          this.password = val.split('').map(Number)
        }
      }
    }
  },
  beforeDestroy() {
    this.items = null
    this.password = null
    this.keys = null
    this.pattern = null
  }
}
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: $uni-bg-color-grey;
  box-sizing: border-box;
  &__header {
    text-align: center;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100upx;
    border-top: 1px solid #ddd;
    font-size: $uni-font-size-lg;
    justify-content: center;
  }
  &__body {
    box-sizing: border-box;
    height: 200upx;
    .password-box {
      height: 90upx;
      text-align: center;
      box-sizing: border-box;
      .password-item {
        height: 100%;
        width: 540upx;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &-char {
          width: 90upx;
          border-bottom: 1px solid $uni-text-color-grey;
          margin: 0 20upx;
          height: 90upx;
          line-height: 90upx;
          text-align: center;
          &:last-child {
            border-right: none;
          }
          &__dot {
            font-size: 60upx;
            height: 60upx;
            line-height: 60upx;
            font-weight: bold;
            color: $uni-text-color-grey;
            // &:after {
            // 	content: '●';
            // }
          }
        }
      }
    }
  }
  .keyboard {
    position: fixed;
    bottom: 0;
    height: 480upx;
    width: 100%;
    // border-top: 1px solid #ddd;
    background: #fff;
    display: flex;
    flex-direction: row;
    .number {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      list-style: none;
      padding: 0 0 0 1px;
      margin: 0;
      // border-right: 1px solid #ddd;
      .button {
        margin: 0;
        padding: 0;
        width: 33%;
        height: 120upx;
        text-align: center;
        line-height: 120upx;
        border-right: 0.5px solid $uni-bg-color-grey;
        border-bottom: 0.5px solid $uni-bg-color-grey;
        font-size: $uni-font-size-lg + 8;
        // font-weight: bold;
        &:nth-child(3),
        &:nth-child(6),
        &:nth-child(9),
        &:nth-child(12) {
          border-right: none;
        }

        &:nth-child(10),
        &:nth-child(11),
        &:nth-child(12) {
          border-bottom: none;
        }
        // &:nth-child(11) {

        // }

        &:active {
          background: $uni-bg-color-grey;
        }
      }
      // .down:after {
      // 	content: '\e902';
      // 	font-family: 'icomoon';
      // 	font-size: 30px;
      // }
    }
    .action {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .delete {
        &:after {
          content: '\e612';
          font-family: 'tyiconfont';
          width: 100%;
          height: 100%;
          line-height: 100%;
          font-size: 52upx;
          display: block;
        }
        &:active {
          // background: #fff;
        }
      }
      // .ok {
      // 	&:after {
      // 		content: '\e901';
      // 		font-family: 'icomoon';
      // 		width: 100%;
      // 		height: 100%;
      // 		line-height: 100%;
      // 		font-size: 42upx;
      // 		display: block;
      // 	}
      // 	&:active {
      // 		// background: #fff;
      // 	}
      // }
    }
  }
}

/*动画*/
@keyframes slidedown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
.slidedown {
  animation: slidedown 0.3s linear;
  transform: translateY(100%);
}
.slideup {
  animation: slideup 0.3s linear;
  transform: translateY(0);
}
@keyframes slideup {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.btn-enter {
  color: $uni-color-warning;
}
</style>
