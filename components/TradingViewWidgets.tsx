 'use client'
import React, { useEffect, useRef, memo } from 'react';
 import useTradingviewWidgets from "@/hooks/useTradingviewWidgets";
 import {cn} from "@/lib/utils";
 interface Tradingviewidgetsprops{
     title?: string;
     scriptUrl: string;
     config: Record<string, unknown>;
     height?: number;
     className?: string;

 }

const TradingViewWidget =({title,scriptUrl,config,height=600,className} :Tradingviewidgetsprops) => {
    const containerRef = useTradingviewWidgets(scriptUrl,config,height);



    return (
        <div className="w-full">
            {title && <h3 className="font-semibolt text-2xl text-gray-10000 mb-5">{title}</h3>}
            <div className={cn('tradingview-widget-container',className)} ref={containerRef} >
                <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>

            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
