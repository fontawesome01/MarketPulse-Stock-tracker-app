'use client';
import {useCallback, useRef} from "react";

useCallback

export function useDebounce(callBack:() => void, delay:number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(() => {
        if(timeoutRef.current)
        {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(callBack,delay);
    },[callBack,delay])
}