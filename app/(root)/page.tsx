

import TradingViewWidgets from "@/components/TradingViewWidgets";
import {HEATMAP_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG} from "@/lib/constant";

const Home = () => {
    const scriptusable=`https://s3.tradingview.com/external-embedding/embed-widget-`
    return (
        <div className="flex min-h-screen home-wrapper">
         <section className="grid w-full gap-8 home-section">
            <div className="md:col-span-1 xl:col-span-1">
                <TradingViewWidgets
                title="market Overview"
                scriptUrl={`${scriptusable}market-overview.js`}
                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                height={600}
                className="custom-chart"
                />

            </div>
             <div className="md:col-span-1 xl:col-span-2">
                 <TradingViewWidgets
                     title="market Overview"
                     scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
                     config={HEATMAP_WIDGET_CONFIG}
                     height={600}
                     className="custom-chart"
                 />
             </div>
         </section>
        </div>
    )
}
export default Home
