'use client';

import { useEffect, useRef } from "react";

const useTradingviewWidgets = (
    scriptUrl: string,
    config: Record<string, unknown>,
    height:number,
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // prevent duplicate loads
        if (containerRef.current.dataset.loaded === "true") return;

        containerRef.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.type = "text/javascript";
        script.innerHTML = JSON.stringify(config);

        containerRef.current.appendChild(script);
        containerRef.current.dataset.loaded = "true";

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                delete containerRef.current.dataset.loaded;
            }
        };
    }, [scriptUrl, config,height]); // ✅ FIXED & STABLE

    return containerRef;
};

export default useTradingviewWidgets;
