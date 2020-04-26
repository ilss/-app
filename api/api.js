/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局配置
 */

// http相关配置
// 接口在线文档 https://documenter.getpostman.com/view/9587481/SW7dWmts
// export const baseUrl = process.env.NODE_ENV === 'development' ?
//   'http://172.19.113.1:3000/' : 'http://114.116.110.224:3005/'
// export let baseUrl = 'http://rap2api.taobao.org/app/mock/243547/' //外网测试使用
// export let baseUrl = 'http://2h805p5374.qicp.vip:26936/' //外网测试使用
// export let baseUrl = 'http://127.0.0.1:3000/'
// export let baseUrl = 'http://192.168.4.13:3000/'   //张工电脑
// export let baseUrl = 'http://192.168.4.8:3000/'
export let baseUrl = 'http://192.168.4.213:3000/'
// export let baseUrl = 'http://114.116.110.224:3005/'


// 一些系统配置
export const options = {
  appName: '临床思维移动版',
  categoryKey: 1202,
  lang: 'zh-CN',
  heartbeatTime: 1000 * 8,
  notifyExamsTime: 1000 * 20,
  innerResource: 'http://114.116.110.224:5000/producerResource/'
}

export const storage = {
  hostIpKey: 'hostIp',
  userData: 'userData'
}

export const account = {
  pwdMinLength: 6,
  nameMinLength: 2,
  nameMaxLength: 20
}

export const ModuleTypeClass = {
  /**
   * 整体训练
   */
  integral: {
    id: 0,
    title: '整体训练'
  },
  /**
   * 问诊
   */
  inquiry: {
    id: 1,
    title: '病例采集'
  },
  /**
   * 体格检查
   */
  physicalCheck: {
    id: 2,
    title: '体格检查'
  },
  /**
   * 辅助治疗
   */
  medicalCheck: {
    id: 3,
    title: '辅助检查'
  },
  /**
   * 诊断
   */
  diagnosis: {
    id: 4,
    title: '诊断'
  },
  /**
   * 诊断依据
   */
  diagnosticBasis: {
    id: 14,
    title: '诊断依据'
  },
  /**
   * 进一步检查
   */
  auxiliaryExamination: {
    id: 24,
    title: '进一步检查'
  },
  /**
   * 治疗原则
   */
  treatment: {
    id: 5,
    title: '治疗原则'
  },
  /**
   * 接诊病人站 7
   */
  caseCollectionStation: {
    id: 7,
    title: '接诊病人站'
  },
  /**
   * 体格检查站 8
   */
  physicalStation: {
    id: 8,
    title: '体格检查站'
  },
  /**
   * 辅助检查站 9
   */
  assistantStation: {
    id: 9,
    title: '辅助检查站'
  },
  /**
   * 临床思维病例分析站 10
   */
  caseAnalysisStation: {
    id: 10,
    title: '病例分析站'
  }
}


// 病例相关
export let caseClass = {
  category: [
    // {
    //   id: '1201.1001',
    //   title: '整体思维训练',
    //   value: ModuleTypeClass.integral
    // },
    {
      id: options.categoryKey + '.1021',
      title: '病史采集站',
      value: ModuleTypeClass.inquiry
    },
    {
      id: options.categoryKey + '.1022',
      title: '体格检查站',
      value: ModuleTypeClass.physicalCheck
    },
    {
      id: options.categoryKey + '.1023',
      title: '接诊病人站',
      value: ModuleTypeClass.caseCollectionStation
    },
    {
      id: options.categoryKey + '.1024',
      title: '辅助检查站',
      value: ModuleTypeClass.assistantStation
    },
    {
      id: options.categoryKey + '.1025',
      title: '病例分析站',
      value: ModuleTypeClass.caseAnalysisStation
    }
  ]
}

export const user = {
  // 登录
  // --request
  //  param:{
  //   name
  //   pwd
  // }
  login: 'Home/User/login',
  // 退出登录
  loginOut: 'Home/User/logout',
  // 轮询账号在线状态
  // --request
  //  {
  //  	"param":{
  //  		"user_guid":"8eeecff0-0fee-11ea-a644-5bf7f7c0b50f",
  // 		"user_id":"89931044979B3309086CED66A1FCC025"
  // 	}
  //  }
  onlineStatus: 'Home/User/heartbeat',
  // 获取首页入口模块
  // --request
  // {
  //  	"param":{
  // 		  "user_select_caseCategoryKey": 1201
  // 	  }
  //  }
  enterModules: 'Home/Functions/getModulesByParams',
  // 获取系统信息     ***弃用
  // --request
  //  {
              // user_select_caseCategoryKey: this.$api.options.categoryKey,
              // user_id: _param.user_id,
              // user_baseRoleId: _param.user_baseRoleId,
              // user_orgid: _param.user_orgid,
              // user_adv_type: _param.user_adv_type,
              // user_type: 'Student'
  // 	}
  //  }
  getProperties: 'Home/Property/getProperties',
  // 注册通用用户
  // --request
  //  {
  //  	"param":{
  // 			"phone":18622332233,
  //      	"captcha":1233,
  // 			"name": sss,
  // 			"password": 234234wer
  // 		}
  //  }
  register: 'Home/User/register',
  // 修改用户名
  // --request
  //  {
  //  	"param":{
  // 			"user_id":"89931044979B3309086CED66A1FCC025",
  // 			"name": "werwer"
  // 		}
  //  }
  editName: 'Home/User/editName',
  // 修改密码
  // --request
  //  {
  //  	"param":{
  // 			"user_id":"89931044979B3309086CED66A1FCC025",
  // 			"oldPwd": "werwer",
  // 			"newPwd": "werwer"
  // 		}
  //  }
  editPassword: 'Home/User/editPassword',
}

export const server = {
  // --request
  time: 'Home/Invigilation/serverTime',
  // 考试中获取服务器时间戳
  // 无需任何参数
  timeSharp: 'Home/Invigilation/serverTime'
}

// 练习相关
export const training = {
  // 点击 开始练习 按钮
  // --request
  // {
  // 	"param":{
  // 		"caseId":"5d6f72ff26859030f49d7eed",
  // 		"moduleType":10,
  // 	  "user_id":"89931044979B3309086CED66A1FCC025",
  //    "user_select_caseCategoryKey": "1201"
  //  }
  // }
  // --response
  // quizType    //1  可继续练习;  0  无继续练习
  start: 'Student/Training/StartTraining',
  // 点击 重新练习 按钮
  // --request
  // {
  // 	"param":{
  // 		"caseId":"5d6f72ff26859030f49d7eed",
  // 		"moduleType":10,
  // 	  "headQuizId":"89931044979B3309086CED66A1FCC025",
  // 	  "user_id":"89931044979B3309086CED66A1FCC025",
  // 	  "user_select_caseCategoryKey": 1201
  // }
  // }
  addQuiz: 'Student/Training/AddQuiz',
  // 获取病例权重
  // --request
  //  param:{
  //   caseId
  // }
  getModuleWeight: 'Student/Training/GetCaseModuleWeight',
  // 获取学生AnswerModel
  // --request
  // {
  //   "param":{
  //     "quizId":"5ddc8ed9a9964a462c9a32cf"
  //   }
  // }
  getAnswer: 'Student/Answer/getAnswer',
  // 保存学生答题数据
  // --request
  // {
  // 	"param":{
  //     "quizId": "5ddc9556f07b2c79e868ff12", 
  //     "user_id":"C69B7095434D62ADEF17CFCEB8851854",
  //     "answer": {"step": 5},
  //     "isPractise": false
  //   }
  // }
  saveAnswer: 'Student/Answer/saveAnswer',
  // 结束训练
  // --request
  // {
  // 	"param":{
  // 		"caseId":"5b95e77e8011b4afc9ca13dd",
  // 		"headQuizId":"5ddcbb30dbae74268ccebd1c",
  // 		"quizId":"5ddcbb30dbae74268ccebd1c"
  // 	}
  // }
  endTraining: 'Student/Training/EndTraining',
  // 获取练习或考试评分数据
  // --request
  // {
  // 	"param":{
  // 		"quizId":"5ddcbb30dbae74268ccebd1c",
  //    "user_type": "Student",
  //    "user_id":"C69B7095434D62ADEF17CFCEB8851854"
  // 	}
  // }
  getTrainingScoreData: 'Student/ScoreQuery/getTrainingScoreData',
  // 获取治疗原则数据
  // --request
  // {
  //   "param": {
  //     "caseId": "5d6f72ff26859030f49d7eed",
  //     "user_select_caseCategoryKey": "1201"
  //   }
  // }
  getTreatmentData: 'Student/Treatment/getTreatmentData'
}

// 考试相关
export const exams = {
  // 获取学生考试信息列表   *弃用
  // --request
  //  param:{
  //   isExternal: null   
  //   user_id
  // }
  getList: 'Student/Exam/getExamsStudent',
  // 轮询获取学生考试信息   20s  *弃用
  // --request
  //  param:{
  //   organizations   组织结构信息 
  //   user_id
  // }
  getNotify: 'Student/Exam/getNotifyExams',
  // 输入考试码进入考试须知
  // --request
  //  param:{
  //   code
  //   user_id
  // }
  enterExam: 'Student/Exam/enterExam',
  // 学生开始考试
  // --request
  //  param:{
  //   examId
  //   user_id
  //   user_select_caseCategoryKey
  // }
  start: 'Student/Exam/startExam',
  // 结束考试
  // --request
  //  param:{
  //   attendanceId
  //   examId
  //   trainingId
  //   user_adv_type
  //   user_guid
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  end: 'Student/Exam/endExam',
  // 获取考试列表
  // --request
  //  param:{
  //   isExternal
  //   user_adv_type
  //   user_guid
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  getExamList: 'Student/Exam/getExamsStudent',
  // 按下 进入考试 按钮, 首先请求 server.timeSharp 判断服务器时间是否开考
  // --request
  //  param:{
  //   examId
  //   user_id
  //   user_select_caseCategoryKey
  // }
  startExam: 'Student/Exam/startExam',
  // 进入考试页面
  // --request
  //  param:{
  //   attendanceId
  //   examId
  // }
  entryQuiz: 'Home/Invigilation/entryQuizByCode',
  // 轮询考试状态 10秒
  // --request
  // {
  // 	"param":{
  // 		"attendanceId": userid,
  // 		"examId":"5ddc7a55472f4f71689f867e"
  // 	}
  // }
  readQuizStatus: 'Home/Invigilation/readQuizStatus',
  // 停止考试
  // --request
  // {
  // 	"param":{
  // 		"attendanceId":"89931044979B3309086CED66A1FCC025",
  // 		"examId":"5ddc7a55472f4f71689f867e",
  // 		"trainingId":"5de87c882d19691b903fddb6",      //QuizId
  // 		"user_id":"89931044979B3309086CED66A1FCC025"
  // 	}
  // }
  endScene: 'Student/Exam/endScene'
}

// 病人相关
export const patient = {
  // 获取病人信息   既往病史
  // --request
  // {
  // 	"param":{
  // 		"caseId":"5b95e77e8011b4afc9ca13dd",
  // 		"user_select_caseCategoryKey":"1201"
  // 	}
  // }
  getInfo: 'Student/PatientInformation/getPatientInformation'
}

// 病例相关
export const cases = {
  // 获取病例列表
  // --request
  //  param:{
  //   type    // 0：整体，1：问诊；2：体格；3：辅助；4：诊断；5：治疗；6：咨询病例；7：考试病例
  //   user_id
  //   user_select_caseCategoryKey,
  //   user_type
  // }
  getList: 'Student/Case/GetCases',
  // 获取最后训练的记录,包含时间和分数.
  // --request
  // {
  // 	"param":{
  // 		"type":10,   //0：整体，1：问诊；2：体格；3：辅助；4：诊断；5：治疗；6：咨询病例；7：考试病例
  // 	"user_id":"89931044979B3309086CED66A1FCC025",
  // 	"user_select_caseCategoryKey": 1201
  // }
  // }
  getLastTrainings: 'Student/Case/getLastTrainings',
  // 获取病例信息
  // --request
  //  param:{
  //   caseId
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  getInfo: 'Student/Case/getCaseInfo',
  // 获取此病例相关问诊信息
  // --request
  //  param:{
  //   caseId
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  getInquiry: 'Student/Inquiry/getCaseInquiryData',
  // 获取问诊时指定病例的所有问题
  // --request
  // {
  // 	"param":{
  // 		"caseId":''
  // 	}
  // }
  getCaseInquiry: 'Student/Inquiry/getCaseInquiryData',
  // 获取病例权重
  // --request
  // {
  // 	"param":{
  // 		"caseId":''
  // 	}
  // }
  getCaseModuleWeight: 'Student/Training/GetCaseModuleWeight',
  // 获得此病例所有检查项
  // --request
  // {
  //   "param": {
  //     "caseId": "5b95e8348011b4afc9ca1412",
  //     "user_select_caseCategoryKey": "1201"
  //   }
  // }
  getPhysicalCheckData: 'Student/PhysicalCheck/getPhysicalCheckData',
  // 获取此病例所有治疗的数据
  // --request
  // {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed",
  //  		"user_select_caseCategoryKey": 1201
  // 	  }
  //  }
  getTreatment: 'Student/Treatment/getTreatmentData',
  // 获取此 辅助检查 数据
  // 左侧的 【检查项目】列表项 遍历数组 data.medicalCheckCategories 显示内部对象的name
  // --request
  //  {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed"
  // 	  }
  //  }
  // 进一步检查用
  getMedicalCheck: 'Student/MedicalCheck/getMedicalCheckData',
  // 单项辅助检查用
  getSpecialMedicalCheckInitData: 'Student/MedicalCheck/getSpecialMedicalCheckData',
  // 获取诊断病历数据
  // --request
  //  {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed",
  // 		  "user_select_caseCategoryKey": 1201
  // 	  }
  //  }
  getDiagnosis: 'Student/Diagnosis/getDiagnosisData',
  // 说明:
  //api/cache/diagnosisItemData_1201_2018_10_17_18_20_39.json   需要用到上面getDiagnosis的返回数据里的releaseTime  拼接成最终地址
  getDiagnosisJson: 'api/cache/diagnosisItemData',
  // 添加诊所 - 搜索
  // --request
  // {
  //  	"param":{
  //  		"keyword":"痢疾"
  // 		  "user_select_caseCategoryKey": 1201
  // 	  }
  //  }
  searchDiagnostic: 'Student/Diagnosis/searchDiagnostic',
  // 获取诊断依据项列表
  // --request
  // {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed",
  //      "modules": [1,2]
  // 	  }
  //  }
  getDiagnosisSupport: 'Student/Diagnosis/getDiagnosisSupport',
  // 获取老师的回答
  // --request
  // {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed",
  //  		"modules":[
  //  			1,2
  //  		]
  // 	  }
  //  }
  getTeacherAnswers: 'Student/Training/GetTeacherAnswers',
  // 获取老师关于医学基础的回答
  // --request
  // {
  //  	"param":{
  //  		"caseId":"5d6f72ff26859030f49d7eed"
  // 	  }
  //  }
  getTeacherAnswersWithFilterMedicalBasis: 'Student/Training/GetTeacherAnswersWithFilterMedicalBasis',


}

// 成绩相关
// export const score = {
// 	// 成绩查询  需要同时请求两个url
// 	scoreQuery: {
// 		// 练习数据
// 		// --request
// 		// param:{
// 		//   user_guid
// 		//   user_id
// 		//   user_select_caseCategoryKey
// 		//   user_type
// 		// }
// 		trainingInitData: 'Student/ScoreQuery/getIntegralTrainingInitData',
// 		trainingScore: 'Student/ScoreQuery/queryIntegralTrainingScore'
// 	}
// }

// 语义识别
export const semantic = {
  // 进入考试后和语义识别系统完成握手
  // --request
  // param:{
  //   caseId
  //   user_adv_type
  //   user_guid
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  handshake: 'Home/SemanticRecognition/handshake',
  // 考试中学生输入问诊后发送给语义识别系统进行匹配
  // --request
  // param:{
  //   caseId
  //   lowSimilarity
  //   question
  //   user_adv_type
  //   user_guid
  //   user_id
  //   user_select_caseCategoryKey
  //   user_type
  // }
  fuzzyMatching: 'Home/SemanticRecognition/fuzzyMatching'
}
// 配置文件中读取分页的数据
// 无需任何参数
// export const paginationcase = 'Home/User/getPaginationcaseData'
