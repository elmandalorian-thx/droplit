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

        // Find the grid wrapper to get its position
        const gridWrapper = document.querySelector('.grid-wrapper');
        if (!gridWrapper) return;

        const gridRect = gridWrapper.getBoundingClientRect();

        // Grid layout constants from CSS
        const cellSize = 50;
        const gap = 12;
        const padding = 16;

        // Check for mobile viewport
        const isMobile = window.innerWidth <= 480;
        const actualCellSize = isMobile ? 40 : cellSize;
        const actualGap = isMobile ? 8 : gap;
        const actualPadding = isMobile ? 12 : padding;

        // Calculate center of each cell: padding + (col * (cellSize + gap)) + (cellSize / 2)
        // start[0] = col, start[1] = row
        const startCenterX = gridRect.left + actualPadding + (start[0] * (actualCellSize + actualGap)) + (actualCellSize / 2);
        const startCenterY = gridRect.top + actualPadding + (start[1] * (actualCellSize + actualGap)) + (actualCellSize / 2);

        const endCenterX = gridRect.left + actualPadding + (end[0] * (actualCellSize + actualGap)) + (actualCellSize / 2);
        const endCenterY = gridRect.top + actualPadding + (end[1] * (actualCellSize + actualGap)) + (actualCellSize / 2);

        setPositions({
            startX: startCenterX,
            startY: startCenterY,
            endX: endCenterX,
            endY: endCenterY,
        });
        calculatedRef.current = true;
    }, [start, end]);

    if (!positions) return null;

    const { startX, startY, endX, endY } = positions;

    return (
        <motion.div
            initial={{
                x: startX,
                y: startY,
                scale: 0.3,
                opacity: 1,
            }}
            animate={{
                x: endX,
                y: endY,
                scale: [0.3, 1.2, 0.95, 1.05, 1],
                opacity: [1, 1, 1, 0.9, 0],
            }}
            transition={{
                duration: 0.65,
                ease: "easeOut",
                scale: {
                    duration: 0.65,
                    times: [0, 0.4, 0.6, 0.8, 1],
                    ease: [0.34, 1.56, 0.64, 1], // Bouncy spring
                },
                opacity: {
                    duration: 0.65,
                    times: [0, 0.6, 0.8, 0.95, 1],
                }
            }}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: `
                    radial-gradient(circle at 30% 30%, rgba(255,180,180,0.9), transparent 50%),
                    radial-gradient(circle at 50% 50%, #ff6b6b, #d63031)
                `,
                boxShadow: `
                    0 0 20px rgba(255, 107, 107, 0.7),
                    0 0 40px rgba(255, 107, 107, 0.4),
                    inset 0 2px 4px rgba(255,255,255,0.5)
                `,
                pointerEvents: 'none',
                zIndex: 1000,
                marginLeft: -12, // Half width to center
                marginTop: -12,  // Half height to center
            }}
        />
    );
}
