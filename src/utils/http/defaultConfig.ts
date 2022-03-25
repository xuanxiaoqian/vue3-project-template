import axios, { AxiosRequestConfig } from 'axios'

export const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 1000
}

export default defaultConfig
