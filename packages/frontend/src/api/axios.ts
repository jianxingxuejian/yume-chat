import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { Router } from 'vue-router'
import { getStorage, showErrorMsg } from '@/utils'

class CustomAxiosInstance {
  instance: AxiosInstance
  router: Router

  constructor(axiosConfig: AxiosRequestConfig, router: Router) {
    this.instance = axios.create(axiosConfig)
    this.router = router
    this.setInterceptor()
  }

  setInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        config.headers['token'] = getStorage<string>('token')
        return config
      },
      () => showErrorMsg(400, '请求错误'),
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { status, data } = response
        if (status !== 200) {
          showErrorMsg(400, '网络错误')
          return data
        }
        if (data.code === 401) {
          const redirect = this.router.currentRoute.value.fullPath
          this.router.push({ name: 'login', query: { redirect } })
          return
        } else if (status !== 200) {
          showErrorMsg(data.code, data.msg)
          return data
        } else {
          return data
        }
      },
      () => showErrorMsg(400, '网络错误'),
    )
  }
}

export function createRequest(axiosConfig: AxiosRequestConfig, router: Router) {
  const instance = new CustomAxiosInstance(axiosConfig, router).instance

  async function get<T = any>(url: string, config?: AxiosRequestConfig) {
    try {
      return (await instance.get(url, config)) as ApiResult<T>
    } catch {
      return
    }
  }

  async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return (await instance.post(url, data, config)) as ApiResult<T>
    } catch {
      return
    }
  }

  return {
    get,
    post,
  }
}
