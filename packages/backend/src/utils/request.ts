import { type Dispatcher, fetch } from 'undici'

export function proxyFetch(dispatcher?: Dispatcher): typeof globalThis.fetch | undefined {
  if (dispatcher) {
    // @ts-expect-error
    return async (req, options) => {
      // @ts-expect-error
      let res = await fetch(req, {
        ...options,
        dispatcher,
      })
      return res
    }
  }
  return undefined
}
