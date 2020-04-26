<template>
  <view class="m-input-view">
    <m-icon
      color="#888"
      class="uni-icons"
      :type="iconClass"
      :size="iconSize"
    ></m-icon>
    <input
      :focus="focus_"
      :type="inputType"
      :value="value"
      @input="onInput"
      :maxlength="maxlength"
      class="m-input-input"
      :placeholder="placeholder"
      :password="type === 'password' && !showPassword"
      :style="'width:' + inputWidth + 'upx;'"
      @focus="onFocus"
      @blur="onBlur"
    />
    <!-- 优先显示密码可见按钮 -->
    <view
      v-if="clearable_ && !displayable_ && value.length"
      class="m-input-icon"
    >
      <m-icon color="#ccc" type="iconguanbi" size="18" @click="clear"></m-icon>
    </view>
    <view v-if="displayable_" class="m-input-icon">
      <m-icon
        :color="showPassword ? '#666' : '#ccc'"
        :type="showPassword ? 'iconxianshimima' : 'iconyincangmima'"
        size="18"
        @click="display"
      ></m-icon>
    </view>
  </view>
</template>

<script>
import mIcon from './m-icon/m-icon.vue'

export default {
  components: {
    mIcon
  },
  props: {
    /**
     * 输入类型
     */
    type: String,
    /**
     * 值
     */
    value: String,
    /**
     * 占位符
     */
    placeholder: String,
    /**
     * 输入框宽度
     */
    maxlength: {
      type: Number,
      default: 50
    },
    /**
     * 输入框宽度
     */
    inputWidth: {
      type: Number,
      default: 480
    },
    /**
     * 输入框左侧icon className
     */
    iconClass: {
      type: String,
      default: ''
    }
    /**
     * 输入框左侧icon 大小
     */,
    iconSize: {
      type: Number,
      default: 18
    },
    /**
     * 是否显示清除按钮
     */
    clearable: {
      type: [Boolean, String],
      default: false
    },
    /**
     * 是否显示密码可见按钮
     */
    displayable: {
      type: [Boolean, String],
      default: false
    },
    /**
     * 自动获取焦点
     */
    focus: {
      type: [Boolean, String],
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      /**
       * 显示密码明文
       */
      showPassword: false,
      /**
       * 是否获取焦点
       */
      isFocus: false
    }
  },
  computed: {
    inputType() {
      const type = this.type
      return type === 'password' ? 'text' : type
    },
    clearable_() {
      return String(this.clearable) !== 'false'
    },
    displayable_() {
      return String(this.displayable) !== 'false'
    },
    focus_() {
      return String(this.focus) !== 'false'
    }
  },
  methods: {
    clear() {
      this.$emit('input', '')
    },
    display() {
      this.showPassword = !this.showPassword
    },
    onFocus() {
      this.isFocus = true
    },
    onBlur() {
      this.$nextTick(() => {
        this.isFocus = false
      })
    },
    onInput(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style scoped>
.m-input-view {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.m-input-input {
  font-size: 30upx;
  margin-left: 10upx;
}

.m-input-icon {
  width: 20upx;
  margin-right: 20upx;
}
</style>
