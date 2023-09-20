

<template>
  <VApp>
    <VLayout class="layout-wrapper layout-nav-type-vertical">
      <RouterView />
      <!-- <BuyNow /> -->
    </VLayout>
  </VApp>
</template>

<script setup lang="ts">
import BuyNow from '@core/components/BuyNow.vue'
onMounted(() => {
  window.onunload = () => {
    sessionStorage['currentSession'] = true
  }
})
</script>

<style scoped>
</style>
