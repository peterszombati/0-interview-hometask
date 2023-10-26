import { createPromise } from "./createPromise"

export class Timer {
  private interval: any = null
  private timeout: any = null

  setInterval(callback: () => void, ms: number) {
    this.clear()
    this.interval = setInterval(() => {
      callback()
    }, ms)
  }

  setTimeout<T>(callback: () => T | Promise<T>, ms: number): Promise<T> {
    this.clear()
    const p = createPromise<T>()
    const timeoutId = setTimeout(() => {
      if (timeoutId === this.timeout) {
        this.timeout = null
      }

      try {
        const result: T | Promise<T> = callback()
        if (result instanceof Promise) {
          result.then((data) => p.resolve(data))
          result.catch(e => p.reject(e))
        } else {
          p.resolve(result)
        }
      } catch (e) {
        // @ts-ignore
        p.reject(e)
      }
    }, ms)
    this.timeout = timeoutId
    return p.promise
  }

  clear() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  isNull() {
    return this.interval === null && this.timeout === null
  }
}