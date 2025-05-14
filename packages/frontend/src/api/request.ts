import { createRequest } from './axios'
import router from '../router'

const request = createRequest({ baseURL: import.meta.env['VITE_API_PREFIX'] }, router)

export default request
