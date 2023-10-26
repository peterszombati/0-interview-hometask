import {RefObject, useEffect, useMemo, useState} from "react"

export function useOnScreen(ref: RefObject<HTMLElement>) {
    const [intersectionEntry, setIntersectionEntry] = useState<null | IntersectionObserverEntry>(null)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => {
            setIntersectionEntry(entry)
        }
    ), [ref])

    useEffect(() => {
        ref.current && observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return intersectionEntry
}