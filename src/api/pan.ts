import request from '@/api/request/index'

const url = '/cloudController'

/**
 * 获取层级文件列表
 * @param params 父级ID
 * @returns
 */
function getFileListByParentID(params: any) {
  return request.get(url + '/getFileListByParentID', { params })
}

function createDir(params: any) {
  return request.get(url + '/createDir', { params })
}

function rename(params: any) {
  return request.put(url + '/rename', { params })
}

export default {
  rename,
  getFileListByParentID,
  createDir,
}
