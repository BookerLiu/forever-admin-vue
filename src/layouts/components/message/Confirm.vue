<template>
  <VDialog v-model="state.showConfirm"
           persistent
           style="margin-bottom: 20%"
           :width="isMobile() ? '' : '20%'">
    <VCard :title="title"
           :subtitle="msg">
      <VCardActions>
        <VSpacer />
        <VBtn right
              @click="state.showConfirm = false">{{cancelText}}</VBtn>
        <VBtn right
              @click="confirmClick">{{confirmText}}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { isMobile } from '@/@core/utils'

const props = defineProps({
  showConfirm: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  msg: {
    type: String,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
})

const state = reactive({
  showConfirm: false,
})

onMounted(() => {
  state.showConfirm = props.showConfirm
})

const emit = defineEmits(['confirmClick']) // 自定义事件的名称
const confirmClick = () => {
  emit('confirmClick', state) // 第一个参数是自定义事件的名称，第二个是要传递的参数
}
</script>
