<template>
  <div v-if="!state.videoRouteShow">

    <VExpansionPanels readonly
                      v-model="state.panels">
      <VExpansionPanel value="moreTypePanel"
                       class="icon">
        <VExpansionPanelTitle>
          <template v-slot:default="{ expanded }">
            <VRow v-if="!isMobile()"
                  cols="12"
                  align="center"
                  justify="center">

              <VCol md="5"
                    lg="5"
                    cols="5">
                <VTabs v-model="state.activeTab"
                       show-arrows
                       center-active
                       centered>
                  <VTab v-for="item in state.tabs"
                        :value="item.id">
                    {{ item.name }}
                  </VTab>
                </VTabs>
              </VCol>
              <VCol md="1"
                    lg="1"
                    cols="1">
                <VBtn variant="text">新建分类</VBtn>
              </VCol>
              <VCol md="1"
                    lg="1"
                    cols="1">
                <VBtn icon
                      variant="text"
                      color="default"
                      class="me-2"
                      size="small"
                      @click="state.panels.length > 0 ? state.panels=[] : state.panels.push('moreTypePanel')">
                  <VIcon icon="mdi-view-grid-plus"
                         size="24" />
                </VBtn>
              </VCol>

            </VRow>
            <VTabs v-if="isMobile()"
                   v-model="state.activeTab"
                   show-arrows
                   center-active
                   centered>
              <VTab v-for="item in state.tabs"
                    :value="item.id">
                {{ item.name }}
              </VTab>
            </VTabs>
            <VBtn v-if="isMobile()"
                  icon
                  variant="text"
                  color="default"
                  class="me-2"
                  size="small"
                  @click="state.panels.length > 0 ? state.panels=[] : state.panels.push('moreTypePanel')">
              <VIcon icon="mdi-view-grid-plus"
                     size="24" />
            </VBtn>
          </template>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow v-if="isMobile()"
                cols="12"
                align="center"
                justify="center">
            <VSpacer />
            <VCol lg="2"
                  md="2"
                  cols="4">
              <VBtn variant="text">新建分类</VBtn>
            </VCol>
          </VRow>
          <VRow cols="12"
                align="center"
                justify="center">
            <VCol lg="6"
                  md="6"
                  cols="12">
              <VRow cols="12"
                    :class="isMobile() ? '' : 'typePanelTextPc'">
                <VCol v-for="item in state.tabs"
                      lg="2"
                      md="2"
                      cols="4"
                      align-self="center">
                  <VBtn variant="text"
                        color="default"
                        class="me-2"
                        @click="state.activeTab = item.id; state.panels = []">
                    {{item.name}}
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VDivider />
    <VWindow v-model="state.activeTab"
             class="mt-5 disable-tab-transition"
             :touch="false">
      <VWindowItem :value="state.activeTab">
        <div v-if="state.videosLoading"
             class="text-center"
             style="margin-top: 5%;">
          <v-progress-circular indeterminate
                               color="primary"></v-progress-circular>
        </div>
        <div v-else>
          <p v-if="state.videos.length === 0"
             style="margin-top: 5%;"
             class="text-center">
            无数据
          </p>
          <VFadeTransition v-show="state.videos.length > 0">
            <VRow cols="12">
              <VCol sm="6"
                    md="2"
                    cols="6"
                    v-for="item in state.videos">
                <VHover v-slot:default="{ isHovering, props }">
                  <VCard :elevation="isHovering ? 15 : 6"
                         v-bind="props"
                         @click="redirectVideo(item)">
                    <VImg :aspect-ratio="16 / 9"
                          :src="item.thumbnail"
                          cover></VImg>
                    <VCardTitle style="font-size:small">
                      <v-tooltip :text="item.fileName">
                        <template v-slot:activator="{ props }">
                          <span v-bind="props">{{ item.fileName }}</span>
                        </template>
                      </v-tooltip>
                    </VCardTitle>

                    <VCardSubtitle style="font-size:x-small">
                      {{item.brief  ? item.brief : '暂无介绍' }}
                    </VCardSubtitle>
                  </VCard>
                </VHover>
              </VCol>
            </VRow>
          </VFadeTransition>

        </div>

      </VWindowItem>
    </VWindow>
    <!-- </v-progress-circular> -->
  </div>
  <VFadeTransition>
    <div v-show="state.videoRouteShow"
         class="text-center">
      <router-view></router-view>
    </div>
  </VFadeTransition>

</template>

<script lang="ts" setup>
import { isMobile } from '@/@core/utils'
import video from '@/api/video'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const state = reactive({
  tabs: [],
  activeTab: '',
  videos: [],
  videosLoading: true,
  hover: true,
  videoRouteShow: false,
  panels: [],
  childRoutePath: '/videos/play-video',
  // moreTypePanelStyle: '',
  desserts: [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      iron: '1%',
    },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      iron: '1%',
    },
    {
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      iron: '7%',
    },
    {
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      iron: '8%',
    },
    {
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      iron: '16%',
    },
    {
      name: 'Jelly bean',
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      iron: '0%',
    },
    {
      name: 'Lollipop',
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      iron: '2%',
    },
    {
      name: 'Honeycomb',
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      iron: '45%',
    },
    {
      name: 'Donut',
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      iron: '22%',
    },
    {
      name: 'KitKat',
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      iron: '6%',
    },
  ],
})

onMounted(async () => {
  //初始化页面
  // state.moreTypePanelStyle = 'width:' + window.innerWidth * 0.6 + 'px'

  if (isMobile()) {
    const eles = document.getElementsByClassName('v-expansion-panel-title__icon')
    for (let ele of eles) {
      ele.style.display = 'none'
    }
  }

  if (route.path === state.childRoutePath) {
    state.videoRouteShow = true
  } else {
    state.videoRouteShow = false
  }

  // 获取分类列表
  const typeRes = await video.getVideoCustomTypes({})
  if (typeRes.code === '200') {
    state.tabs = typeRes.data
    state.activeTab = state.tabs[0].id
  }
})

watch(
  () => state.activeTab,
  async (newTab, oldTab) => {
    if (newTab !== oldTab) {
      //获取视频列表
      console.log(newTab)
      state.videosLoading = true
      const videosRes = await video.getVideos({ customTypeId: state.activeTab })
      if (videosRes.code === '200') {
        state.videos = videosRes.data.list
        state.videosLoading = false
      }
    }
  },
)

window.onresize = function () {
  // state.moreTypePanelStyle = 'width:' + window.innerWidth * 0.8 + 'px'
  // state.cardStyle = 'height:' + window.innerHeight * 0.8 + 'px'
}

const redirectVideo = (info: any) => {
  localStorage.setItem('videoInfo', JSON.stringify(info))
  router.push({
    path: state.childRoutePath,
  })
}
onBeforeRouteUpdate(to => {
  if (to.path === state.childRoutePath) {
    state.videoRouteShow = true
  } else {
    state.videoRouteShow = false
  }
})
</script>

<route lang="yaml">
  meta:
    navActiveLink: pages-index-video-play
</route>

<style scoped lang="scss">
.typePanelText {
  padding-right: 18%;
}
</style>
