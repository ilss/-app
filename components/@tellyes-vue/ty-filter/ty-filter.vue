<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 下拉筛选组件
-->
<template>
  <view v-if="menuList.length > 0">
    <view :style="{ height: tabHeight + 1 + 'upx' }">
      <view
        :class="topFixed ? 'select-tab-fixed-top' : 'select-tab'"
        :style="{ height: tabHeight + 'upx' }"
      >
        <view
          class="select-tab-item"
          :style="{ width: itemWidth }"
          v-for="(item, index) in titleList"
          :key="index"
          @tap="showMenuClick(index)"
        >
          <text :style="{ color: color }">{{ item.title }}</text>
          <text
            class="arrows sl-font"
            :class="statusList[index].isActive ? up : down"
          ></text>
        </view>
      </view>
    </view>
    <pop-layer
      ref="popupRef"
      :direction="'bottom'"
      @close="close"
      :isTransNav="isTransNav"
      :navHeight="navHeight"
      :tabHeight="tabHeight"
    >
      <sl-filter-view
        :ref="'slFilterView'"
        :independence="independence"
        :needConfirmButton="needConfirmButton"
        :themeColor="themeColor"
        :menuList.sync="menuListTemp"
        ref="slFilterView"
        @confirm="filterResult"
      ></sl-filter-view>
    </pop-layer>
  </view>
</template>

<script>
import popLayer from './popup-layer.vue'
import slFilterView from './filter-view.vue'
export default {
  components: {
    popLayer,
    slFilterView
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    themeColor: {
      type: String,
      default() {
        return '#000'
      }
    },
    color: {
      type: String,
      default() {
        return '#666'
      }
    },
    needConfirmButton: {
      type: Boolean,
      default: false
    },
    independence: {
      type: Boolean,
      default: false
    },
    isTransNav: {
      type: Boolean,
      default: false
    },
    navHeight: {
      type: Number,
      default: 0
    },
    topFixed: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    itemWidth() {
      return 'calc(100%/2)'
    },
    menuListTemp: {
      get() {
        return this.getMenuListTemp()
      },
      set(newObj) {
        return newObj
      }
    }
  },
  mounted: function() {
    let arr = []
    let titleArr = []
    let r = {}
    for (let i = 0, len = this.menuList.length; i < len; i++) {
      arr.push({
        isActive: false
      })
      // titleArr.push({
      // 	'title': this.menuList[i].title,
      // 	'key': this.menuList[i].key
      // });
      r[this.menuList[i].key] = this.menuList[i].title

      if (
        this.menuList[i].reflexTitle &&
        this.menuList[i].defaultSelectedIndex > -1
      ) {
        titleArr.push({
          title: this.menuList[i].detailList[
            this.menuList[i].defaultSelectedIndex
          ].title,
          key: this.menuList[i].key
        })
      } else {
        titleArr.push({
          title: this.menuList[i].title,
          key: this.menuList[i].key
        })
      }
    }
    this.statusList = arr
    this.titleList = titleArr
    this.tempTitleObj = r
  },
  data() {
    return {
      canClick: true,
      down: 'sl-down',
      up: 'sl-up',
      tabHeight: 100,
      statusList: [],
      selectedIndex: '',
      titleList: [],
      tempTitleObj: {}
    }
  },
  methods: {
    getMenuListTemp() {
      let arr = this.menuList
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i]
        for (let j = 0, len = item.detailList.length; j < len; j++) {
          let d_item = item.detailList[j]
          if (j === 0) {
            d_item.isSelected = true
          } else {
            d_item.isSelected = false
          }
        }
      }
      return arr
    },
    // 重置所有选项，包括默认选项，并更新result
    resetAllSelect(callback) {
      this.$refs.slFilterView.resetAllSelect(function(e) {
        callback(e)
      })
    },
    // 重置选项为设置的默认值，并更新result
    resetSelectToDefault(callback) {
      this.$refs.slFilterView.resetSelectToDefault(function(e) {
        callback(e)
      })
    },
    resetMenuList(val) {
      this.menuList = val
      this.$emit('update:menuList', val)
      this.$forceUpdate()
      this.$refs.slFilterView.resetMenuList(val)
    },
    showMenuClick(index) {
      if (this.canClick) {
        this.canClick = false
        setTimeout(() => {
          this.canClick = true
        }, 1000)
      } else {
        return
      }
      this.selectedIndex = index
      if (this.statusList[index].isActive === true) {
        this.$refs.popupRef.close()
        this.statusList[index].isActive = false
      } else {
        this.menuTabClick(index)
        this.$refs.popupRef.show()
      }
    },
    menuTabClick(index) {
      this.$refs.slFilterView.menuTabClick(index)
      for (let i = 0, len = this.statusList.length; i < len; i++) {
        if (index === i) {
          this.statusList[i].isActive = true
        } else {
          this.statusList[i].isActive = false
        }
      }
    },
    filterResult(obj) {
      let val = obj.result
      let titlesObj = obj.titles
      // 处理选项映射到菜单title
      if (this.independence) {
        if (
          !this.menuList[this.selectedIndex].isMutiple ||
          this.menuList[this.selectedIndex].isSort
        ) {
          let tempTitle = ''
          for (
            let i = 0,
              len = this.menuList[this.selectedIndex].detailList.length;
            i < len;
            i++
          ) {
            let item = this.menuList[this.selectedIndex].detailList[i]
            if (item.value === val[this.menuList[this.selectedIndex].key]) {
              tempTitle = item.title
            }
          }
          if (this.menuList[this.selectedIndex].reflexTitle) {
            this.titleList[this.selectedIndex].title = tempTitle
          }
        }
      } else {
        for (let key in titlesObj) {
          if (!Array.isArray(titlesObj[key])) {
            this.tempTitleObj[key] = titlesObj[key]
          }
        }
        for (let key in this.tempTitleObj) {
          for (let i = 0, len = this.titleList.length; i < len; i++) {
            if (this.titleList[i].key === key) {
              this.titleList[i].title = this.tempTitleObj[key]
            }
          }
        }
      }

      this.$refs.popupRef.close()
      if (obj.isReset) {
      } else {
        this.$emit('result', val)
      }
    },
    close() {
      for (let i = 0, len = this.statusList.length; i < len; i++) {
        this.statusList[i].isActive = false
      }
    }
  }
}
</script>

<style scoped>
@import 'iconfont/iconfont.css';
.select-tab {
  border-bottom: #f7f7f7 1px solid;
  background-color: #fff;
  display: flex;
  width: 100%;
}

.select-tab-fixed-top {
  border-bottom: #f7f7f7 1px solid;
  background-color: #fff;
  display: flex;
  width: 100%;
  position: fixed;
  z-index: 101;
}

.arrows {
  margin-left: 10upx;
}

.select-tab .select-tab-item,
.select-tab-fixed-top .select-tab-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-tab .select-tab-item text,
.select-tab-fixed-top .select-tab-item text {
  color: #666;
  font-size: 32upx;
}
</style>
