import { getStorage, setStorage, removeStorage } from '@/utils'
import { register, login, logout } from '@/api'

export const useUserStore = defineStore('user-store', () => {
  const token = ref(getStorage('token') as string)
  const userInfo = ref(JSON.parse(getStorage('userInfo') || '{}') as User.LoginResult['userinfo'])

  function setInfo(result?: User.LoginResult) {
    if (!result) return
    token.value = result.token
    setStorage('token', result.token)
    userInfo.value = result.userinfo
    setStorage('userInfo', JSON.stringify(result.userinfo))
  }

  async function userRegister(param: User.RegisterParam) {
    const result = await register(param)
    return setInfo(result?.data)
  }

  async function userLogin(param: User.LoginParam) {
    const result = await login(param)
    return setInfo(result?.data)
  }

  function userLogout() {
    logout()
    removeStorage('token')
    removeStorage('userInfo')
    token.value = ''
  }

  return {
    token,
    userInfo,
    userRegister,
    userLogin,
    userLogout,
  }
})
