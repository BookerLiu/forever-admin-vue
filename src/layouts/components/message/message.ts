import { createApp } from 'vue'
import vuetify from '@/plugins/vuetify'
import Message from './Message.vue'
import Confirm from './Confirm.vue'

const defaultSuccessrDuration = 3000
const defaultWarningDuration = 3000
const defaultErrorDuration = 3000

function success(message: string, duration = defaultSuccessrDuration) {
  const color = 'success'
  const icon = 'mdi-check-circle'
  common(message, color, duration, icon)
}

function warning(message: string, duration = defaultWarningDuration) {
  const color = 'warning'
  const icon = 'mdi-alert'
  common(message, color, duration, icon)
}

function error(message: string, duration = defaultErrorDuration) {
  const color = 'error'
  const icon = 'mdi-alert-circle'
  common(message, color, duration, icon)
}

function common(message: string, color: string, duration = 3000, icon = 'mdi-check') {
  message = '  ' + message
  const mountNode = document.createElement('div')
  //存储消息数量
  let messageCountStr = localStorage.getItem('messageCount')
  let messageCount
  if (!messageCountStr) {
    messageCount = 0
  } else {
    messageCount = Number(messageCountStr)
  }
  messageCountStr = String(++messageCount)
  localStorage.setItem('messageCount', messageCountStr)

  setTimeout(() => {
    let messageCountStr = localStorage.getItem('messageCount')
    let messageCount
    if (!messageCountStr) {
      messageCount = 0
    } else {
      messageCount = Number(messageCountStr)
    }
    messageCountStr = String(--messageCount)
    localStorage.setItem('messageCount', messageCountStr)
  }, duration)

  createApp(Message, {
    message,
    color,
    duration,
    icon,
  })
    .use(vuetify)
    .mount(mountNode)

  // document.body.appendChild(mountNode)
}

function confirm(title: string, msg: string, confirmClick: Function, confirmText?: string, cancelText?: string) {
  const mountNode = document.createElement('div')

  createApp(Confirm, {
    showConfirm: true,
    title,
    msg,
    onConfirmClick(dialogState: any) {
      confirmClick(dialogState)
    },
    confirmText,
    cancelText,
  })
    .use(vuetify)
    .mount(mountNode)
  document.body.appendChild(mountNode)
}

export default {
  success,
  warning,
  error,
  confirm,
  defaultSuccessrDuration,
  defaultWarningDuration,
  defaultErrorDuration,
}
