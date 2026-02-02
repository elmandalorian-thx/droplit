import { useEffect, useRef } from 'react';
import './WaterBackground.css';

interface WaterBackgroundProps {
    interactive?: boolean;
}

export function WaterBackground({ interactive = true }: WaterBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!interactive || !containerRef.current) return;

        const container = containerRef.current;

        const handleClick = (e: MouseEvent) => {
            createRipple(e.clientX, e.clientY);
        };

        const createRipple = (x: number, y: number) => {
            const ripple = document.createElement('div');
            ripple.className = 'water-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            container.appendChild(ripple);

            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 2000);
        };

        container.addEventListener('click', handleClick);

        return () => {
            container.removeEventListener('click', handleClick);
        };
    }, [interactive]);

    return (
        <div ref={containerRef} className="water-background">
            {/* Ambient ripples */}
            <div className="ambient-ripples">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="ambient-ripple"
                        style={{
                            left: `${15 + (i * 15)}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.8}s`,
                        }}
                    />
                ))}
            </div>

            {/* Gradient overlay for depth */}
            <div className="water-gradient" />

            {/* Caustic light effect */}
            <div className="caustics" />
        </div>
    );
}
