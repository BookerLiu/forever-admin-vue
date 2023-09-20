import request from '@/api/request/index'

const videoUrl = '/videosController'

/**
 * 获取分类
 * @param params
 * @returns
 */
function getVideoCustomTypes(params: any): Promise<any> {
  return request.get(videoUrl + '/getVideoCustomTypes', { params })
}

/**
 * 获取videos
 * @param params
 * @returns
 */
function getVideos(params: any): Promise<any> {
  return request.get(videoUrl + '/getVideos', { params })
}

/**
 * 存储播放记录
 * @param data
 * @returns
 */
function playLog(dataParam: any): Promise<any> {
  return request.post(videoUrl + '/playLog', dataParam)
}

export default {
  getVideoCustomTypes,
  getVideos,
  playLog,
}
