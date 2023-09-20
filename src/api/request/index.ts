import Request from '@/api/request/request'

const request = new Request({})

function get(url: string, params: any) {
  return request.get(url, params)
}

function put(url: string, params: any) {
  return request.put(url, null, params)
}

function putData(url: string, data: any, params?: any) {
  return request.put(url, data, params)
}

function del(url: string, params: any) {
  return request.delete(url, params)
}

function post(url: string, params: any) {
  return request.post(url, null, params)
}

function postData(url: string, data: any, params?: any) {
  return request.post(url, data, params)
}

function postFormData(url: string, data: any) {
  let fd = new FormData()
  for (let key in data) {
    fd.append(key, data[key])
  }
  return request.post(url, fd)
}

export default {
  del,
  put,
  get,
  post,
  postFormData,
}
