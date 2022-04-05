import Axios, { AxiosInstance } from 'axios'

import defaultConfig from './defaultConfig'

export class Interceptors {
  public instance: AxiosInstance

  constructor() {
    this.instance = Axios.create(defaultConfig)

    this.init()
  }

  init() {
    // 数据请求之前
    this.instance.interceptors.request.use(
      (config: any) => {
        // console.log("请求了");
        return config
      },
      (err) => {
        console.log(err)
      }
    )

    // 数据返回之前
    this.instance.interceptors.response.use(
      (response) => {
        // console.log("响应了");
        return Promise.resolve(response)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  getInterceptors() {
    return this.instance
  }
}
const instance = new Interceptors().getInterceptors()

export default instance
