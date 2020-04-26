<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 图片放大预览页
-->
<template>
  <view class="content">
    <ty-album :imageArray="albumImagesArray"></ty-album>
  </view>
</template>

<script>
import tyAlbum from '@/components/@tellyes-vue/ty-album/ty-album.vue'
export default {
  components: { tyAlbum },
  data() {
    return {
      albumImagesArray: this.$store.state.albumImagesArray
    }
  },
  beforeDestroy() {
    this.albumImagesArray = null
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: black;
}
</style>
