export class Time {
    protected unit: number
    protected UTCTimestamp: number

    constructor() {
        this.unit = performance.now()
        this.UTCTimestamp = Date.now()
        return this
    }

    public getDifference(time: Time): number {
        return time.elapsedMs() - this.elapsedMs()
    }

    public get(): Date {
        return new Date(Date.now() - (performance.now() - this.unit))
    }

    public elapsedMs(): number {
        return performance.now() - this.unit
    }

    public getUTC(): Date {
        return new Date(this.UTCTimestamp)
    }
}