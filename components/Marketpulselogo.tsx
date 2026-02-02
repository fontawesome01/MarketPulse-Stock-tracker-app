type LogoProps = {
    className?: string;
};

export default function MarketPulseLogo({ className }: LogoProps) {
    return (

        <svg
            viewBox="0 0 220 42"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="MarketPulse logo"
            className="h-[32px] h-[32px]"
        >
            {/* Bars */}
            <rect x="6" y="28" width="10" height="18" rx="2" fill="#2563EB" />
            <rect x="18" y="22" width="10" height="24" rx="2" fill="#22C55E" />
            <rect x="30" y="16" width="10" height="30" rx="2" fill="#F59E0B" />
            <rect x="42" y="10" width="10" height="36" rx="2" fill="#EF4444" />



            <text
                x="60"
                y="40"
                font-size="24"
                font-weight="700"
                fill="#FFFFFF"
                font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            >
                Market
                <tspan
                    fill="#22C55E"
                    dx="4"
                    letter-spacing="0.5"
                >
                    Pulse
                </tspan>
            </text>

        </svg>

    );
}
