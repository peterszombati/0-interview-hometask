import {Time} from "./Time"
import {createPromise} from "./createPromise"
import {Timer} from "./Timer"

export class Queue<Task, Result> {
  private interval: number
  private delay: number
  private process: (queue: Queue<Task, Result>, tasks: {
    createdAt: Time
    data: Task
    resolve: (data: Result) => void
    reject: (e: Error) => void
  }[]) => Promise<void>

  private tasks: {
    createdAt: Time
    data: Task
    resolve: (data: Result) => void
    reject: (e: Error) => void
  }[] = []
  private lastRun: null | Time = null
  private timer: Timer = new Timer()

  constructor(
    interval: number,
    delay: number,
    process: (queue: Queue<Task, Result>, tasks: {
      createdAt: Time
      data: Task
      resolve: (data: Result) => void
      reject: (e: Error) => void
    }[]) => Promise<void>,
  ) {
    this.interval = interval
    this.delay = delay
    this.process = process
  }

  private processTasks(): void {
    this.lastRun = new Time()
    this.process(this, this.tasks.splice(0,this.tasks.length))
  }

  private triggerStart() {
    if (!this.timer.isNull()) {
      return
    }
    const elapsedMs = this.lastRun === null ? this.interval : this.lastRun.elapsedMs()
    if (elapsedMs >= this.interval) {
      const maxElapsedMs = this.maxElapsedMs() || 0
      if (maxElapsedMs < this.delay) {
        this.timer.setTimeout(() => this.processTasks(), this.delay - maxElapsedMs)
      } else {
        this.processTasks()
      }
    } else {
      this.timer.setTimeout(() => this.processTasks(), this.interval - elapsedMs)
    }
  }

  push({data,createdAt,resolve,reject}: {
    data: Task
    createdAt?: Time | undefined
    resolve?: (data: Result) => void | undefined
    reject?: (e: Error) => void | undefined
  }): Promise<Result> | undefined {
    const {promise,resolve:_resolve,reject:_reject}: {
      promise?: Promise<Result>
      resolve: (data: Result) => void | undefined
      reject: (e: Error) => void | undefined
    } = resolve && reject ? { resolve, reject } : createPromise<Result>()
    this.tasks.push({
      createdAt: createdAt || new Time(),
      data,
      resolve: _resolve,
      reject: _reject,
    })
    this.triggerStart()
    return promise
  }

  unshift({data,createdAt,resolve,reject}: {
    data: Task
    createdAt?: Time | undefined
    resolve?: (data: Result) => void | undefined
    reject?: (e: Error) => void | undefined
  }): Promise<Result> | undefined {
    const {promise,resolve:_resolve,reject:_reject}: {
      promise?: Promise<Result>
      resolve: (data: Result) => void | undefined
      reject: (e: Error) => void | undefined
    } = resolve && reject ? { resolve, reject } : createPromise<Result>()
    this.tasks.unshift({
      createdAt: createdAt || new Time(),
      data,
      resolve: _resolve,
      reject: _reject,
    })
    this.triggerStart()
    return promise
  }

  maxElapsedMs(): number | null {
    return (this.tasks.length != 0 || null) && Math.max(...this.tasks.map(i => i.createdAt.elapsedMs()))
  }
}