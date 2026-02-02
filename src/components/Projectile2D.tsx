import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Projectile } from '../store/gameStore';

interface Projectile2DProps {
    projectile: Projectile;
}

export function Projectile2D({ projectile }: Projectile2DProps) {
    const { start, end } = projectile;
    const [positions, setPositions] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const calculatedRef = useRef(false);

    useEffect(() => {
        if (calculatedRef.current) return;

        const gridWrapper = document.querySelector('.grid-wrapper');
        if (!gridWrapper) return;

        const gridRect = gridWrapper.getBoundingClientRect();

        // Grid layout constants
        const isMobile = window.innerWidth <= 480;
        const cellSize = isMobile ? 40 : 50;
        const gap = isMobile ? 8 : 12;
        const padding = isMobile ? 12 : 16;

        // Calculate cell centers
        const startCenterX = gridRect.left + padding + (start[0] * (cellSize + gap)) + (cellSize / 2);
        const startCenterY = gridRect.top + padding + (start[1] * (cellSize + gap)) + (cellSize / 2);
        const endCenterX = gridRect.left + padding + (end[0] * (cellSize + gap)) + (cellSize / 2);
        const endCenterY = gridRect.top + padding + (end[1] * (cellSize + gap)) + (cellSize / 2);

        setPositions({ startX: startCenterX, startY: startCenterY, endX: endCenterX, endY: endCenterY });
        calculatedRef.current = true;
    }, [start, end]);

    if (!positions) return null;

    const { startX, startY, endX, endY } = positions;

    return (
        <motion.div
            initial={{
                x: startX,
                y: startY,
                scale: 0.4,
                opacity: 0.9,
            }}
            animate={{
                x: endX,
                y: endY,
                scale: [0.4, 0.9, 1.1, 1],
                opacity: [0.9, 1, 1, 0],
            }}
            transition={{
                duration: 0.45, // Faster for snappier feel
                ease: [0.22, 1, 0.36, 1], // Smooth ease-out
                scale: {
                    duration: 0.45,
                    times: [0, 0.5, 0.8, 1],
                },
                opacity: {
                    duration: 0.45,
                    times: [0, 0.3, 0.85, 1],
                }
            }}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                // Blue gradient to blend with target drop
                background: 'radial-gradient(circle at 30% 30%, #81c9ff, #4facfe)',
                // Simplified shadow for GPU performance
                boxShadow: '0 0 12px rgba(79, 172, 254, 0.6)',
                pointerEvents: 'none',
                zIndex: 1000,
                marginLeft: -14,
                marginTop: -14,
                willChange: 'transform, opacity', // GPU acceleration
            }}
        />
    );
}

