/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 一些通用函数
 */
import crypto from 'crypto'
/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQueryArray(list, keyWord) {
  var reg = new RegExp(keyWord)
  var arr = []
  for (var i = 0; i < list.length; i++) {
    if (reg.test(list[i])) {
      arr.push(list[i])
    }
  }
  return arr
}
/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQueryString(str, keyWord) {
  var reg = new RegExp(keyWord)
  return reg.test(list[i])
}

/**
 * 数据加密
 * @param  {Array}  data     原数据
 * @return {Array}           加密数据
 */
export function encryption(data) {
  return data
  // data = JSON.stringify(data)
  // let crypto = require('crypto'),
  //   clearEncoding = 'utf8',
  //   cipherEncoding = 'base64',
  //   cipherChunks = [],
  //   cipher = crypto.createCipheriv('aes-128-ecb', 'Tellyes800921234', '')
  // cipher.setAutoPadding(true)
  // cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding))
  // cipherChunks.push(cipher.final(cipherEncoding))
  // return cipherChunks.join('')
}
/**
 * 数据解密
 * @param  {Array}  data     原数据
 * @return {Array}           解密数据
 */
let cipherChunks,
  decipher
export function decryption(data) {
  return data
  if (!data) return false
  cipherChunks = []
  decipher = crypto.createDecipheriv('aes-128-ecb', 'Tellyes800921234', '')
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(data, 'base64', 'utf8'))
  cipherChunks.push(decipher.final('utf8'))
  // console.log(JSON.parse(cipherChunks.join('')))
  return JSON.parse(cipherChunks.join(''))
}

export function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

export function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
var dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000
  },
  humanize: function(milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function(dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function(number) {
      return (number < 10 ? ('0' + number) : number);
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' +
      _format(date.getDay()) + '-' +
      _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};


//工具包
//正则匹配
//匹配帐号
export const regUid = function(str) {
  return !RegExp(/^\w{6,12}$/).test(str);
}

export const regUserName = function(str) {
  return !RegExp(/^[\u4e00-\u9fa5]{2,5}$/).test(str);
}

//匹配身份证
export const regIDC = function(str) {
  return !RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(str);
}

//匹配手机号
export const regPhone = function(str) {
  return !RegExp(/^1[34578]\d{9}$/).test(str);
}
//匹配验证码
export const regCheckNum = function(str) {
  return !RegExp(/^\d{4}$/).test(str);
}

//匹配邮箱格式
export const regEmail = function regEmail(str) {
  return !RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(str);
}
