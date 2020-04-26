<!--
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 关于我们
-->
<template>
  <view
    class="content"
    style="background-color: #FFF; text-align: center;"
  >
    <!-- <ty-nav-bar
     backState="1000"
      type="fixed"
      title="关于"
    ></ty-nav-bar> -->
    <!-- <luch-audio src="http://114.116.110.224:3000/producerResource/01/01578c209ba63cbea6fee4146627448e.mp3" :play.sync="audioPlay"></luch-audio> -->
    <!--    <view @tap="audioPlay">开始播放</view> -->
    <image
      src="../../static/img/login/logo@3x.png"
      mode="aspectFit"
      style="width:150px; height: 150px;"
      v-once
    ></image>
    <view class="app-name">{{ appName }}</view>
    <view class="app-verstion">Version {{ appVersion }}</view>
    
    <view :class="showEnter ? 'animated fadeIn' : 'hidden'">
      <view class="app-name" v-once>天堰科技股份有限公司</view>
      <view v-once class="company-info">
        天津天堰科技股份有限公司是以现代化医学教学产品研发、生产、销售为主营业务的高新技术企业,
        公司在基于机器人技术的模拟病人、基于虚拟现实技术的手术训练器、现代化医学培训管理系统与训练软件、现代技术支撑的传统中医训练系统几大领域开展创新及研发工作,向业界提供基于上述技术的十二大系列、千余种医学虚拟教学产品。公司于2015年7月在新三板上市（股票代码833047），是国内医学教学虚拟现实技术与服务的设计者，也是国内高端医教产品研发制造商。
      </view>
      <view v-once class="company-info">
        长期以来，天堰公司以科技创新为首位，致力于核心技术的提升和自主知识产权产品的研究开发，公司已通过国家高新技术企业认证,是天津市级企业技术中心，天津市中医工程及医学虚拟技术工程中心。公司拥有实力雄厚的研发团队，管理团队和技术骨干均毕业于国内外一流院校，拥有丰富的医教行业从业经验，为公司发展提供强有力的人才支撑。截止目前，公司及其子公司共申请相关领域内的知识产权1172项，其中发明专利263项，实用新型专利512项，软件著作权167项。近年来，公司先后承担了国家科技部创新基金项目、国家重点研发计划项目、国家服务业专项资金项目和天津市重点科技研发项目几十项，获得天津市科技进步一等奖、三等奖，多项产品被录入国家自主创新产品目录。
      </view>
      <view v-once class="company-info">
        天堰目前拥有医学模拟教学领域各学科产品，包括护理、临床、妇幼、康复、口腔、急救、虚拟医学、中医、多媒体软件、影像、解剖和动物医学等。为应对医疗社会化培训服务的市场趋势及需求，天堰公司兴建了天堰医学模拟中心，并引入了美国梅奥医学院实训中心培训机构课程，与以色列希巴（Shaba）医疗中心MSR实训中心、特拉维夫中心医院开展以灾难医学研究为主要方向的医疗实训中心共建工作，为我国的医疗社会化培训工作开展做好充分准备。
      </view>
      <view v-once class="company-info">
        多年来，公司秉承“天堰
        让真实触手可及”的宗旨，国内市场份额迅速提升，业务领域不断扩大。公司与国内3000多家医学院校及医院建立了长期稳固的合作关系，同时产品实现出口，打入欧洲、亚洲、非洲、美洲等多国市场。
        国际化合作也是天堰公司经营的重要组成部分，目前公司代理全球30余家医教领域一流企业的产品，确保了天堰公司能够为客户提供具有国际化水平的全方位服务。
      </view>
      <view v-once class="company-info">
        除实现企业自身发展，天堰公司还注重企业社会责任的实现。2005年，天堰公司提出以“天堰杯”的形式赞助医学院校举办技能大赛，为比赛提供用品、技术服务及资金等全方位支持。活动沿袭至今，在医教行业取得良好效果，影响力不断扩大。近年来，天堰公司共赞助和组织国家级、省市级大赛和会议270余次，是国内各级医学类技能大赛重要的赞助商和比赛产品提供商，为推动国内医教行业发展和医疗技术水平的提高做出了不懈努力。
      </view>
      <view v-once class="company-info">
        天津天堰科技股份有限公司愿与您一起携手走向医疗教育培训行业发展的更美好的明天！
      </view>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      appVersion: '',
      appName: '',
      showEnter: false
    }
  },
  components: {},
  mounted() {
    // #ifdef APP-PLUS
    const _this = this
    plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
      _this.appVersion = widgetInfo.version
      _this.appName = widgetInfo.name
    })
    // #endif
    let t=setTimeout(() => {
      this.showEnter = true
      clearTimeout(t)
    }, 200)
  },
  methods: {
    audioPlay() {
      // const innerAudioContext = uni.createInnerAudioContext()
      // innerAudioContext.autoplay = true
      // innerAudioContext.volume = 1
      // innerAudioContext.src =
      //   'http://114.116.110.224:3000/producerResource/01/01578c209ba63cbea6fee4146627448e.mp3'
      // innerAudioContext.onPlay(() => {
      //   console.log('开始播放')
      // })
      // innerAudioContext.onError(res => {
      //   console.log(res.errMsg)
      //   console.log(res.errCode)
      // })
      // innerAudioContext.onPlay(res => {
      //   console.log(innerAudioContext.duration)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 $ty-content-padding;
}
.app-name {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20upx;
}
.app-verstion {
  font-size: 14px;
  text-align: center;
  padding-bottom: 47upx;
  margin-bottom: 47upx;
  border-bottom: 1px solid $uni-border-color;
}
.company-info {
  font-size: 14px;
  text-indent: 2em;
  text-align: left;
  padding-bottom: 20upx;
  &:last-child {
    padding-bottom: 60upx;
  }
}
</style>
