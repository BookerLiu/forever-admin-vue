<template>
  <v-snackbar :absolute="true"
              :top="true"
              :color="color"
              :timeout="duration"
              v-model="showSnackbar"
              elevation="24">
    <VIcon left>{{ icon }}</VIcon> {{ message }}
  </v-snackbar>
</template>
  
<script lang="ts">
import { isMobile } from '@/@core/utils'
export default defineComponent({
  props: {
    color: {
      type: String,
    },
    duration: {
      type: Number,
    },
    message: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  data() {
    return {
      showSnackbar: true,
    }
  },
  updated() {
    // message消息队列的实现
    // 设置snackbar 容器位置
    let eles = document.getElementsByClassName('v-overlay__content')
    for (let ele of eles) {
      let eleStyle = ele.getAttribute('style')
      if (ele.hasChildNodes() && (!eleStyle || eleStyle.indexOf('1%')) === -1) {
        let childEles = ele.children
        for (let childEle of childEles) {
          if (childEle.getAttribute('class')?.indexOf('v-snackbar__wrapper') != -1) {
            ele.style.top = '1%'
            ele.style.bottom = ''
            break
          }
        }
      }
    }

    //设置 snackbar 位置
    let sonEles = document.getElementsByClassName('v-snackbar__wrapper')

    let topNum = 0
    if (sonEles.length > 1) {
      const lastHasStyleEle = sonEles[sonEles.length - 2]
      const style = lastHasStyleEle.getAttribute('style')
      // top: 60px;
      let styleTop = style?.substring(style.lastIndexOf(': ') + 1, style.lastIndexOf('p'))
      topNum = Number(styleTop) + 60
    } else {
      topNum = 1 * 60
    }

    const lastSonEle = sonEles[sonEles.length - 1]
    if (isMobile()) {
      lastSonEle.style['min-width'] = window.innerWidth * 0.75 + 'px'
      lastSonEle.style['max-width'] = '100%'
    }
    const lastSonStyle = lastSonEle.getAttribute('style')
    if (!lastSonStyle || lastSonStyle?.indexOf('top') === -1) {
      lastSonEle.style.top = topNum + 'px'
      lastSonEle.style.bottom = ''
    }
  },
})
</script> 

