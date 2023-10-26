import {ComponentPropsWithoutRef, FC, ReactNode, useEffect, useRef, useState} from "react";
import {useOnScreen} from "./useOnScreen";
import {Time} from "../utils/Time";

type Props = {
    timeout: number
    callback: (params: {start: Time, entry: IntersectionObserverEntry}) => void
    children: ReactNode
} & ComponentPropsWithoutRef<"div">
export const Seen: FC<Props> = ({timeout, callback, children}) => {
    const [timeoutId, setTimeoutId] = useState<null | number>(null)

    const ref = useRef<HTMLDivElement>(null)
    const entry = useOnScreen(ref)
    const start = new Time()

    useEffect(() => {
        timeoutId && clearTimeout(timeoutId)
        if (entry?.isIntersecting) {
            // @ts-ignore
            setTimeoutId(setTimeout(() => callback({
                start,
                entry,
            }), timeout - start.elapsedMs()))
        }

        return () => {timeoutId && clearTimeout(timeoutId)}
    }, [entry?.isIntersecting])

    return <div ref={ref}>{children}</div>
}