/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: HTTP请求封装
 */
import {
  decryption
} from "./utils.js"

//请求接口函数
function fetch(method, url, data, loading) {
  return new Promise((resolve, reject) => {
    //显示加载动画
    // if (loading) utils.showLoading()

    //获取token
    // let token = wx.getStorageSync("token")

    // let obj = { token, }

    //添加token
    // Object.assign(data,obj)

    //发起请求
    uni.request({
      url,
      method,
      data,
      // header: {
      // 数据被编码为名称/值对
      //"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      // },
      success: res => {
        // let code = res.data.code
        // let message = res.data.message

        let _data = decryption(res.data)
        // console.log(_data);
        if (
          !_data.data || !_data.success) {
          reject(false)
        }
        resolve(_data.data)
        //统一处理返回值
        // switch (code) {
        //     case 200 :
        //         resolve(res.data.data)
        //         break
        //     case 403 :
        //         utils.showToast('您的账号已离线，请重新登录')
        //         utils.goLogin()
        //         break
        //     case 423 :
        //         utils.showToast('账号异地登录，请重新登录')
        //         utils.goLogin()
        //         break
        //     default:
        //         utils.showToast(`${message}`)
        // }
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        //结束加载动画
        // if (loading) utils.hideLoading()
      }
    })
  }).catch((e) => {})
}

export default {
  get: function(url, params, loading) {
    return fetch('GET', url, params, loading)
  },
  post: function(url, params, loading) {
    return fetch('POST', url, params, loading)
  },
  put: function(url, params, loading) {
    return fetch('PUT', url, params, loading)
  },
  delete: function(url, params, loading) {
    return fetch('DELETE', url, params, loading)
  }
}
