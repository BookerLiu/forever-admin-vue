import request from '@/api/request/index'

import { serverUri } from '@/api/serverUrl'

const url = '/fileController'

/**
 * 检查文件是否存在
 * @param params MD5
 * @returns
 */
function checkFileExits(params: any) {
  return request.get(url + '/checkFileExist', { params })
}

/**
 * 上传文件
 * @param data 文件信息
 * @returns
 */
function upFile(data: any): Promise<any> {
  return request.postFormData(url + '/fileUp', data)
}

/**
 * 合并文件
 * @param params MD5
 * @returns
 */
function mergeCutFile(params: any) {
  return request.get(url + '/mergeCutFile', { params })
}

/**
 * 获取文件下载授权token
 * @param params md5
 * @returns
 */
function getDownloadToken(params: any) {
  return request.get(url + '/getDownloadToken', { params })
}

//文件下载url 新开页面下载
const downUrl = serverUri + 'lsp' + url + '/downloadFile'

function downloadFile(url: string) {
  window.location.href = url

  // const link = document.createElement('a')
  // link.style.display = 'none'
  // link.href = url
  // document.body.appendChild(link)
  // link.click()
  // document.body.remove(link)
}

function deleteFiles(dataParams: any) {
  return request.post(url + '/deleteFiles', dataParams)
}

export default {
  checkFileExits,
  upFile,
  mergeCutFile,
  getDownloadToken,
  downUrl,
  downloadFile,
  deleteFiles,
}
