/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../api/api.js'
import {
  decryption,
  encryption
} from "@/util/utils.js"
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userOnlineInterval: null, //clearUserData中停止
    notifyExamInterval: null, //clearUserData中停止
    scanResult: null, //扫描考试码的结果
    hasLogin: false, //是否已登录
    isHeartbeat: false, //心跳是否已开启
    // isNotifyHeartbeat: false, //考试通知轮询开关
    globalNotice: '', //全局通知内容  只要不为空  界面就会显示通知气泡
    examIdArray: [], //考试列表里的考试ID
    openCaseCategory: null, //服务器开放的练习模块
    targetExamId: null,
    targetExamInfo: {
      // "case_id": "5e82b1bbf4e2143d50651229",
      // "name": "22",
      // "start_time": "2020-03-31T03:02:00.000Z",
      // "enter_time": 555,
      // "end_time": "2020-03-31T12:47:00.000Z",
      // "notice": "",
      // "duration": 30,
      // "allowCommitTime": 0,
      // "first_time": "2020-03-31T12:47:00.000Z"   //首次进入时间
    }, //输入考试码后获得的考务信息  
    targetExamEndime: null, //当前考试结束时间
    targetExamType: null, //  'uniform' 统一开考    'anyTime' 随到随考
    // targetExamTimeData: null, //进行中考试的时间相关数据 entryQuiz 返回的
    targetCaseId: null,
    practiceCanBack: false, //练习 考试中禁止后退按键, 结束考试时传入true可正常后退.
    studentSelectedDiagnosis: [], // 诊断和诊断依据 两个模块通信用的
    albumImagesArray: [], // 图片查看组件所需url数组
    meExamDataArray: {
      exams: [],
      noData: false
    },
    caseListData: null, //练习界面的病例列表
    serverTime: null, //服务器时间   随心跳更新
    startExamData: {}, //开始考试服务器返回的考试相关数据, 后来还存入了 病例ID
    // 用户相关
    user: {
      userInfo: '',
      organizations: {}, //组织信息
      param: {
        user_adv_type: '',
        user_guid: '',
        user_id: '',
        user_select_caseCategoryKey: api.options.categoryKey,
        user_type: ''
      }
    }
  },
  // 同步方法
  mutations: {
    login(state) {
      state.hasLogin = true
    },
    clearUserData(state, inLogin) {
      this.hasLogin = false
      // uni.removeStorage({
      // 	key: api.storage.userData
      // })
      console.log(inLogin + '----------clearUserData')
      if(!state.userOnlineInterval){
        return
      }
      clearInterval(state.userOnlineInterval)
      state.userOnlineInterval = null
      // clearInterval(state.notifyExamInterval)
      // state.notifyExamInterval = null
      if (inLogin !== 'login') {
        uni.reLaunch({
          url: '../login/login'
        })
      }
    },
    logout(state) {
      uni.showLoading({
        title: '用户注销中...',
        mask: true
      })
      let _data = {
        'param': this.state.user.param
      }
      // _data = encryption(_data)
      uni.request({
        url: api.baseUrl + api.user.loginOut,
        data: _data,
        method: 'POST',
        success: res => {
          this.commit('clearUserData')
        },
        fail: e => {
          console.log(e)
        },
        complete: () => {
          _data = null
          uni.hideLoading()
        }
      })
    },
    updateServerTime(state, time) {
      state.serverTime = time
    },
    practiceCanBack(state, isOk) {
      state.practiceCanBack = isOk
    },
    updateUserInfo(state, data) {
      state.isHeartbeat = false

      let user = state.user
      user.userInfo = data.data
      user.organizations = user.userInfo.organization
      user.param = data.user_param
      user.param.user_select_caseCategoryKey = api.options.categoryKey
      user = null
      // user.user_name = user.userInfo.name || '游客'
      // user.param.user_guid = param.user_guid || ''
      // user.param.user_id = param.user_id || ''
      // user.param.user_type = param.user_type || ''
      // user.param.user_type = param.user_type || ''
    },
    setCaseCategory(state, array) {
      state.openCaseCategory = array
    },
    // 当前进入的病例ID
    setTargetCaseId(state, data) {
      state.targetCaseId = data
    },
    // 当前考试数据
    saveStartExamData(state, data) {
      state.startExamData = data
      state.targetCaseId = data.caseId
    },
    clearTargetExamData(state) {
      state.startExamData = null
      state.targetCaseId = null
      state.targetExamId = null
    },
    //考务信息
    setTargetExamInfo(state, data) {
      state.targetExamInfo = data
    },
    saveTargetExamId(state, data) {
      state.targetExamId = data
    },
    setTargetExamType(state, data) {
      state.targetExamType = data < 0 ? 'uniform' : 'anyTime'
    },
    saveTargetExamFirstTime(state, data) {
      state.targetExamInfo.first_time = data
    },
    clearTargetExamFirstTime(state) {
      state.targetExamFirstTime = null
    },
    clearGlobalNotice(state) {
      state.globalNotice = ''
    },
    initCaseListData(state, data) {
      state.caseListData = {
        ...data
      }
    },
    updateCaseScore(state, data) {
      let _case = state.caseListData.cases.find(item => item._id === data
        .id)
      Vue.set(_case, 'correctnessScore', data.score + '')
      _case = null
      // console.log(state.caseListData.cases);
    }
  },
  // 异步方法
  actions: {
    // *暂时弃用
    getExamsStudent(content) {
      // const _this = this
      console.log('getExamsStudent')
      let _data = {
        param: {
          isExternal: null,
          user_id: this.state.user.param.user_id
        }
      }
      // _data = encryption(_data)
      uni.request({
        url: api.baseUrl + api.exams.getList,
        method: 'POST',
        data: _data,
        success: res => {
          let _data = decryption(res.data).data
          if (toString.call(_data) !== '[object Array]') {
            _data = []
            console.warn('getExamsStudent响应数据res.data.data不是数组')
          }
          this.state.meExamDataArray.exams = [..._data]

          this.state.meExamDataArray.noData = _data.length >
            0 ? false : true

          let postNotice = false
          // 检索是否包含这些考试ID,如果已包含就无需再通知
          this.state.meExamDataArray.exams.map(exam => {
            if (this.state.examIdArray.sort().toString().indexOf(
                exam._id.toString()) < 0) {
              this.state.examIdArray.push(exam._id)
              postNotice = true
            }
          })
          // if (postNotice) {
          //   this.state.globalNotice = '您有新的考试'
          // }
        },
        fail: () => {
          console.warn(`----------获取考试列表数据错误`)
        },
        complete: () => {
          _data = null
        }
      })
    },
    /**
     * 用户状态检测  ， 轮询考试状态
     * @param {Object} content $store
     * @param {string} 根据您参数决定跳转页面/是否执行hideLoading
     */
    userOnlineStatus(content, inLogin) {
      let _param = this.state.user.param,
        _data = {
          'param': _param
        }
      console.log('userOnlineStatus')
      // _data = encryption(_data)
      uni.request({
        url: api.baseUrl + api.user.onlineStatus,
        data: _data,
        method: 'POST',
        success: res => {
          const data = decryption(res.data).data
          if (!data || !data.success) {
            this.commit('clearUserData', inLogin)
          } else {
            this.state.serverTime = data.item.last_time
            this.commit('login')
            this.dispatch('getUserOnlineStatus')
            if (inLogin === 'login') {
              uni.reLaunch({
                url: '../main/main'
              })
            }
          }
          if (inLogin !== 'heartbeated') {
            uni.hideLoading()
          }
        },
        fail: e => {
          let t = setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '服务器失去响应'
            })
          }, 1000)
          clearTimeout(t)
          t = null
          this.commit('clearUserData')
        },
      })
      let examId = this.state.targetExamId
      if (examId) {
        // 考试状态
        _data = {
          'param': {
            attendanceId: _param.user_id,
            examId: examId
          }
        }
        // _data = encryption(_data)
        uni.request({
          url: api.baseUrl + api.exams.readQuizStatus,
          data: _data,
          method: 'POST',
          success: res => {
            const data = decryption(res.data).data
            //考试状态   0未开始    1考试中    4已结束
            // console.log(data.data[0].status);
            if(!examId){
              return
            }
            if (data.data[0].status === 4) {
              let t1 = setTimeout(() => {
                  uni.reLaunch({
                    url: '../main/main'
                  })
                  clearTimeout(t1)
                  t1 = null
                }, 1000),
                t2 = setTimeout(() => {
                  uni.showModal({
                    showCancel: false,
                    content: '考试已中途终止',
                    complete: function(res) {

                    }
                  })
                  clearTimeout(t2)
                  t2 = null
                }, 2000)
            }
          }
        })
      }
    },
    // 心跳检测用户在线状态
    getUserOnlineStatus(content) {
      if (this.state.isHeartbeat) {
        return
      }
      let _state = this.state
      _state.isHeartbeat = true
      let time = api.options.heartbeatTime
      if (!_state.userOnlineInterval) {
        _state.userOnlineInterval = setInterval(() => {
          this.dispatch('userOnlineStatus', 'heartbeated')
        }, time)
      }
      _state = null
      // if (_state.isNotifyHeartbeat) {
      //   return
      // }
      // _state.isNotifyHeartbeat = true
      // time = api.options.notifyExamsTime

      // if (!this.state.notifyExamInterval) {
      //   this.state.notifyExamInterval = setInterval(() => {
      //     this.dispatch('getExamsStudent')
      //   }, time)
      // }
    }
  },
  getters: {
    userId(state) {
      return state.user.param.user_id
    },
    userData(state) {
      return state.user
    },
    getToken(state) {
      return state.user.userInfo.token
    },
    userParam(state) {
      return state.user.param
    },
    isHeartbeat(state) {
      return state.heartbeated
    },
    isLgoin(state) {
      return state.hasLogin
    },
    userNotifyExams(state) {
      return state.hasNotifyExams
    },
    myExamsData(state) {
      return state.meExamDataArray.exams
    },
    getQuizId(state) {
      return state.startExamData.quizId
    },
    // 当前进入的病例ID
    getTargetCaseId(state) {
      return state.targetCaseId
    },
    getStartExamData(state) {
      return state.startExamData
    },
    serverTime(state) {
      return state.serverTime
    },
    getPracticeCanBack(state) {
      return state.practiceCanBack
    },
    getCaseCategory(state) {
      return state.openCaseCategory
    },
    getTargetExamId(state) {
      return state.targetExamId
    },
    //考务信息
    getTargetExamInfo(state) {
      return state.targetExamInfo
    },
    getStudentSelectedDiagnosis(state) {
      return state.studentSelectedDiagnosis
    }
  }
})

export default store
