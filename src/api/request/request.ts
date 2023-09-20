// index.ts
import Message from '@/layouts/components/message/message'
import router from '@/router/index'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
class Request {
  // axios 实例
  instance: AxiosInstance
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 60000 }

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 一般会请求拦截里面加token
        const token = localStorage.getItem('token')
        config.headers['token'] = token

        return config
      },
      (err: any) => {
        return Promise.reject(err)
      },
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        return res.data
      },
      (err: any) => {
        // 这里用来处理http常见错误，进行全局提示
        let msg: String | any = ''
        switch (err.response.status) {
          case 400:
            msg = '请求错误(400)'
            break
          case 401:
            msg = err.response.data.msg
            // 这里可以做清空storage并跳转到登录页的操作
            break
          case 403:
            msg = '拒绝访问(403)'
            break
          case 404:
            msg = '请求出错(404)'
            break
          case 408:
            msg = '请求超时(408)'
            break
          case 500:
            msg = '服务器错误(500)'
            break
          case 501:
            msg = '服务未实现(501)'
            break
          case 502:
            msg = '网络错误(502)'
            break
          case 503:
            msg = '服务不可用(503)'
            break
          case 504:
            msg = '网络超时(504)'
            break
          case 505:
            msg = 'HTTP版本不受支持(505)'
            break
          default:
            msg = `连接出错(${err.response.status})!`
        }
        Message.error(msg)
        if (err.response.status === 401) {
          // let timeout = Message.defaultErrorDuration
          // if (msg.code === "601") {
          //   timeout = 0
          // }

          localStorage.clear()
          setTimeout(
            () =>
              router.replace({
                path: 'login',
                query: { redirect: router.currentRoute.fullPath },
              }),
            Message.defaultErrorDuration,
          )
        }

        return Promise.reject(err.response)
      },
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<any> {
    return this.instance.request(config)
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.get(url, config)
  }
  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config)
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.put(url, data, config)
  }

  public delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.delete(url, config)
  }
}

export default Request
