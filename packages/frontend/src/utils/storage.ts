interface StorageData {
  value: unknown
  expire: number | null
}

type StorageKey = 'token' | 'userInfo'

export function setStorage(key: StorageKey, value: unknown, expire?: number) {
  const data: StorageData = {
    value,
    expire: expire !== undefined ? new Date().getTime() + expire * 1000 : null,
  }
  const json = JSON.stringify(data)
  window.localStorage.setItem(key, json)
}

export function getStorage<T>(key: StorageKey): T | null {
  const json = window.localStorage.getItem(key)
  if (json) {
    const { value, expire } = JSON.parse(json) as StorageData
    if (expire === null || expire >= Date.now()) {
      return value as T
    }
    removeStorage(key)
  }
  return null
}

export function removeStorage(key: StorageKey) {
  window.localStorage.removeItem(key)
}
