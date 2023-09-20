import request from '@/api/request/index'

export function login(data: any): Promise<any> {
  return request.postFormData('/login', data)
}
