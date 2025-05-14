const errorMsgStack = new Map<number, string>()

const ERROR_MSG_DURATION = 2000

export function showErrorMsg(code: number, msg: string): void {
  if (errorMsgStack.has(code)) return

  errorMsgStack.set(code, msg)
  window.$message.error(msg, { duration: ERROR_MSG_DURATION })
  setTimeout(() => {
    errorMsgStack.delete(code)
  }, ERROR_MSG_DURATION)
}
