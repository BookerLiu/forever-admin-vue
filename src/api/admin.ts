import request from '@/api/request/index'

const url = '/adminController'

/**
 * 文件列表
 * @returns
 */
function fileList(params: any) {
  return request.get(url + '/fileList', { params })
}

export default {
  fileList,
}
