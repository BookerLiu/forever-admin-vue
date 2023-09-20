<template>
  <svg aria-hidden="true"
       :width="width"
       :height="height">
    <use :xlink:href="symbolId"
         :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: '25px',
  },
  height: {
    type: String,
    default: '25px',
  },
  color: {
    type: String,
    default: '#333',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
