import request from '../request'

export async function register(params: User.RegisterParam) {
  return request.post<User.LoginResult>('/user/register', params)
}

export async function login(params: User.LoginParam) {
  return request.post<User.LoginResult>('/user/login', params)
}

export async function logout() {
  return request.post<null>('/user/logout')
}
