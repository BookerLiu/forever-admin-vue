<template>
  <VRow cols="12"
        no-gutters>
    <VCol md="8"
          lg="8"
          xs="12"
          sm="12"
          cols="12">
      <VideoPlayer :source='source'
                   :options="{}"
                   :poster="state.info.thumbnail" />
    </VCol>
    <VCol md="3"
          lg="3"
          xs="12"
          sm="12"
          cols="12"
          style="margin: 10px; padding: 20px">
      <!-- <VCardSubtitle>
          {{info.name}}
        </VCardSubtitle>
        <VCardText>
          {{info.synopsis ? info.synopsis : '暂无介绍'}}
        </VCardText> -->
      <h4 class="text-left">{{state.info.fileName}}</h4>
      <p class="text-left">&emsp;{{state.info.brief ? state.info.brief : '暂无介绍'}}</p>
    </VCol>
  </VRow>

</template>

<script lang="ts" setup>
// 引入videojs以及样式文件
import VideoPlayer from '@/layouts/components/video-player.vue'
import { serverUri } from '@/api/serverUrl'

const state = reactive({
  token: localStorage.getItem('token'),
  info: JSON.parse(localStorage.getItem('videoInfo')),
})

console.log(state.info)
const source = {
  src: `${serverUri}lsp/videosController/playVideo?md5=${state.info.md5}&token=${state.token}`,
  type: `video/${state.info.format}`,
}
</script>


<style lang="scss" scoped>
.synopsis {
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 10px;
  p {
    margin-top: 5px;
    margin-right: 40px;
  }
}
</style>


