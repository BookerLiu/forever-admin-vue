import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router'
import routes from '~pages'

let routeArr = setupLayouts(routes)

// for (let i = 0; i < routeArr.length; i++) {
//   let route = routeArr[i]
//   if (route.path === '/') {
//     // route.children[0].children[0].name = 'index-video-play/:info'
//     route.children[0].children[0].path = 'video-play/:info?'
//     console.log(route.children[0].children[0])
//     // let indexVideoPlayRoute = indexRoute.children[0]
//     // indexVideoPlayRoute.path = 'video-play/:info?'
//   }
// }
console.log(routeArr)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeArr,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
