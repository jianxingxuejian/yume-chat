declare namespace User {
  interface RegisterParam {
    password: string
    username: string
    code: string
  }

  interface LoginParam {
    username: string
    password: string
  }

  interface LoginResult {
    token: string
    userinfo: {
      id: string
      name: string
      avatar: string
    }
  }
}
