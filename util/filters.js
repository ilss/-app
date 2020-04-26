/*
 * @Author: Liang Liang #skrjs.com
 * @Date: 2020-03-18 08:55:11
 * @Description: 全局filter
 */
export function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * UTC时间格式化为本地时间
 * 兼容移动端  要 把 - 改为 /
 * @param {Object} time   服务器传来的 ISO时间
 */
export function GMTToStr(time) {
  let date = new Date(time)
  let Str = date.getFullYear() + '/' +
    (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
    date.getDate().toString().padStart(2, '0') + ' ' +
    date.getHours().toString().padStart(2, '0') + ':' +
    date.getMinutes().toString().padStart(2, '0') + ':' +
    date.getSeconds().toString().padStart(2, '0')
  return Str
}
export function checkCost(cost){
  cost = parseFloat(cost).toFixed(2)
  return cost+'元'
}
/**
 * @param {Object} time1  服务器传来的 UTC时间
 * @param {Object} time2  分钟数
 */
export function timeComputed(time1, time2) {
  let date1 = new Date(time1)
  return GMTToStr(Date.parse(date1) + time2 * 60 * 1000)
}

/**
 * 计算某个时间与现在时间的时间差 毫秒
 * @param {Object} time1   服务器传来的 ISO时间
 */
export function timeBetween(time1, time2) {
  const e = Date.parse(time1)
  const b = Date.parse(time2)
  return e - b
}

/**
 * 格式化时间
 * @param {Object} mss  时间差毫秒
 * @param {Object} all  传值表示 返回全格式 0天0时0分20秒
 */
export function formatTime(mss, all) {
  if(!mss){
    return '0秒'
  }
  const days = parseInt(mss / (1000 * 60 * 60 * 24))
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = parseInt((mss % (1000 * 60)) / 1000)
  let labelDay, labelHour, labelMinute
  
  if (!all) {
    labelDay = days > 0 ? days + "天" : ''
    if (days < 1) {
      labelHour = hours > 0 ? hours + "小时" : ''
      if (hours < 1) {
        labelMinute = minutes > 0 ? minutes + "分" : ''
      } else {
        labelMinute = minutes + "分"
      }
    } else {
      labelHour = hours + "小时"
    }
  } else {
    labelDay = days + "天"
    labelHour = hours + "小时"
    labelMinute = minutes + "分"
  }
  return labelDay + labelHour + labelMinute + seconds + "秒"
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' 分钟')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' 时')
  } else {
    return pluralize(~~(between / 86400), ' 天')
  }
}

export function toThousandslsFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')

  var r = window.location.search.substr(1).match(reg)

  if (r != null) return (r[2])
  return null
}
