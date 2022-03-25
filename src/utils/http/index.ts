import { AxiosPromise, AxiosResponse, AxiosRequestConfig, AxiosInstance, Method } from 'axios'

import instance from './interceptors'

export class HttpServer {
  public axios: AxiosInstance

  constructor() {
    this.axios = instance
  }

  public request(
    method: Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>,
    url: string,
    param?: object
  ): AxiosPromise {
    const config = {
      method,
      url,
      ...param
    }

    return new Promise((resolve, reject) => {
      this.axios
        .request(config)
        .then((res: AxiosResponse) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

const http = new HttpServer()

export default http
