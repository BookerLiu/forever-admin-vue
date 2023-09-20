<template>

  <video ref="video_player"
         :poster="poster"
         class="video-js vjs-default-skin vjs-fluid vjs-big-play-centered"
         controls>

    <source :src="source.src"
            :type="source.type" />
  </video>

</template>
<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-landscape-fullscreen'
// import '@layouts/styles/videojs_custom.css'
import zh from 'video.js/dist/lang/zh-CN.json'
import videoAPI from '@/api/video'

const props = withDefaults(
  defineProps<{
    options: any
    source: any
    poster: any
  }>(),
  {
    options: {
      muted: true,
      controls: true,
      autoplay: false,
      // currentTimeDisplay: 0,
      loop: true,
      language: 'zh-CN',
      techOrder: ['html5'],
      playbackRates: [0.5, 1, 1.5, 2, 3],
    },
    poster: '',
    source: {
      src: '',
      type: '',
    },
  },
)

const state = reactive({
  options: {
    muted: true,
    controls: true,
    autoplay: false,
    // currentTimeDisplay: 0,
    loop: false,
    language: 'zh-CN',
    techOrder: ['html5'],
    playbackRates: [0.5, 1, 1.5, 2, 3],
  },
})

onMounted(() => {
  state.options = Object.assign(state.options, props.options)
  initPlay()
})

const video_player = ref()
let player: VideoJsPlayer
const initPlay = async () => {
  videojs.addLanguage('zh-CN', zh)
  await nextTick()

  player = videojs(video_player.value, state.options, () => {
    videojs.log('播放器已经准备好了!')
  })

  //横屏播放支持
  player.landscapeFullscreen({
    fullscreen: {
      enterOnRotate: true,
      exitOnRotate: true,
      alwaysInLandscapeMode: true,
      iOS: true,
    },
  })

  let currentTimeTemp = 0
  const subTime = 5

  const videoInfo = JSON.parse(localStorage.getItem('videoInfo'))
  player.on('timeupdate', function () {
    //当前播放时长(秒)
    let currentTime = Math.floor(player.currentTime())
    if (
      (currentTime != currentTimeTemp && Math.abs(currentTime - currentTimeTemp) > subTime) ||
      currentTime % subTime == 0
    ) {
      // 每隔5秒 或者手动更改了进度，向服务器提交播放记录(秒)
      let dataParam = {
        md5: videoInfo.md5,
        playDuration: currentTime,
      }
      console.log(videoInfo)
      console.log(dataParam)
      videoAPI.playLog(dataParam)
    }
    currentTimeTemp = currentTime
  })

  player.on('ended', () => {
    videojs.log('播放结束了!')
  })
  player.on('error', () => {
    videojs.log('播放器解析出错!')
  })
}

//直接改变路径测试
watch(props.source, () => {
  player.pause()
  player.src(props.source.src)
  player.load()
  if (props.source.src) {
    player.play()
  }
})
onBeforeUnmount(() => {
  player?.dispose()
})
</script>

<!-- <script lang="ts" setup src="//acdn.adnxs.com/video/plugins/cp/PrebidPluginCP.min.js" onload="doHeaderBidding()">
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'
// import '@layouts/styles/videojs_custom.css'
import zh from 'video.js/dist/lang/zh-CN.json'

const props = withDefaults(
  defineProps<{
    options: any
    source: any
  }>(),
  {
    options: {
      muted: true,
      controls: true,
      autoplay: false,
      // currentTimeDisplay: 0,
      loop: true,
      language: 'zh-CN',
      techOrder: ['html5'],
      playbackRates: [0.5, 1, 1.5, 2, 3],
      hls: {
        overrideNative: true,
      },
      headers: {
        userId: '1231241515',
      },
    },
    source: {
      src: '',
      type: '',
    },
  },
)

const state = reactive({
  options: {},
})
let options = {
  biddersSpec: {
    code: 'video1',
    sizes: [640, 480],
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480],
        mimes: ['video/mp4'],
        protocols: [1, 2, 3, 4, 5, 6, 7, 8],
        playbackmethod: [2],
        playbackRates: [0.5, 1, 1.5, 2, 3],
        skip: 1,
      },
    },
    bids: [
      {
        bidder: 'appnexus',
        params: {
          placementId: '13232361', // Add your own placement id here
        },
      },
    ],
  },
  prebidConfigOptions: {
    cache: {
      url: 'https://prebid.adnxs.com/pbc/v1/cache',
    },
  },
  dfpParameters: {
    params: {
      iu: '/19968336/prebid_cache_video_adunit',
      cust_params: {
        section: 'blog',
        anotherKey: 'anotherValue',
      },
      output: 'vast',
    },
  },
}
function doHeaderBidding() {
  window.prebidPluginCP.doPrebid(options)
}

var page_load_time

page_load_time = new Date().getTime() - performance.timing.navigationStart
console.log(page_load_time + 'ms -- Player loading!')

// var vid1 = videojs('vid1')

page_load_time = new Date().getTime() - performance.timing.navigationStart
console.log(page_load_time + 'ms -- Player loaded!')

function invokeVideoPlayer(url) {
  page_load_time = new Date().getTime() - performance.timing.navigationStart
  console.log(page_load_time + 'ms -- Prebid VAST url = ' + url)

  /* Access the player instance by calling `videojs()` and passing
    in the player's ID. Add a `ready` listener to make sure the
    player is ready before interacting with it. */

  videojs('vid1').ready(function () {
    page_load_time = new Date().getTime() - performance.timing.navigationStart
    console.log(page_load_time + 'ms -- Player is ready!')

    /* PASS SETTINGS TO VAST PLUGIN

        Pass in a JSON object to the player's `vastClient` (defined
        by the VAST/VPAID plugin we're using). The requires an
        `adTagUrl`, which will be the URL returned by Prebid. You
        can view all the options available for the `vastClient`
        here:

        https://github.com/MailOnline/videojs-vast-vpaid#options */

    var player = this
    var vastAd = player.vastClient({
      adTagUrl: url,
      playAdAlways: true,
      verbosity: 4,
      vpaidFlashLoaderPath: 'https://github.com/MailOnline/videojs-vast-vpaid/blob/RELEASE/bin/VPAIDFlash.swf?raw=true',
      autoplay: true,
    })

    page_load_time = new Date().getTime() - performance.timing.navigationStart
    console.log(page_load_time + 'ms -- Prebid VAST tag inserted!')

    player.muted(true)
    player.play()

    page_load_time = new Date().getTime() - performance.timing.navigationStart
    console.log(page_load_time + 'ms -- invokeVideoPlayer complete!')
  })
}
var messageId = 100
var getVastUrl = function () {
  var message = {
    command: 'PPCP:prebidRequest',
    messageId: ++messageId,
  }
  return new Promise(function (resolve) {
    var listener = function (event) {
      if (event && event.data) {
        var data = {}
        try {
          data = JSON.parse(event.data)
        } catch (error) {}
        if (data.command === 'PPCP:prebidResponse' && data.messageId === messageId) {
          window.removeEventListener('message', listener)
          if (data.url && data.url != 'failed') {
            resolve(data.url)
          } else {
            resolve(null)
          }
        }
      }
    }
    window.addEventListener('message', listener)
    top.postMessage(JSON.stringify(message), '*')
    setTimeout(function () {
      window.removeEventListener('message', listener)
      resolve(null)
    }, 2000)
  })
}

getVastUrl()
  .then(function (url) {
    invokeVideoPlayer(url)
  })
  .catch(function () {
    invokeVideoPlayer(null)
  })
</script> -->

<style lang="scss" scoped>
.video-js .vjs-big-play-button {
  border: unset !important;
  background-color: unset !important;
}
.video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  font-size: 45px;
}
</style>
