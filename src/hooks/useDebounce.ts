import {useCallback, useRef} from "react";

export default function useDebounce(cb, delay){
    const timer = useRef()

    const debouncedCallback = useCallback((args) => {
        if(timer.current){
            clearTimeout(timer.current)
        }

        // @ts-ignore
        timer.current = setTimeout(() => {
            console.log(`args = ${args}`)
            cb(args)
        }, delay)

    }, [cb, delay])

    return debouncedCallback
}