import vue from 'vue'
import tyNotice from './ty-notice.vue'

const ToastConstructor = vue.extend(tyNotice)

function showTyNotice({
  text,
  type,
  duration = 4000
}) {
  type = type || 'info'

  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data() {
      return {
        isShow: true, // 是否显示
        text: text, // 文本内容
        type: type // 类型
      }
    }
  })
  // toastDom.$el.id = 'ty_notice_list'
  document.body.appendChild(toastDom.$el)
  // 延时关闭
  setTimeout(() => {
    // toastDom.$el.classList.remove("fade-in")
    toastDom.$el.classList.add("fade-out")
    setTimeout(function() {
      toastDom.isShow = false
    }, 1500);
  }, duration)
}

function registryToast() {
  vue.prototype.$tyNotice = showTyNotice
}

export default registryToast