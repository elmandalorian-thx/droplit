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

        // Find actual cell positions by querying the grid cells
        const gridWrapper = document.querySelector('.grid-wrapper');
        if (!gridWrapper) return;

        const cells = gridWrapper.querySelectorAll('.cell-container');
        const gridCols = 6;

        // start[0] = col, start[1] = row
        const startCellIndex = start[1] * gridCols + start[0];
        const endCellIndex = end[1] * gridCols + end[0];

        const startCell = cells[startCellIndex];
        const endCell = cells[endCellIndex];

        if (startCell && endCell) {
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();

            setPositions({
                startX: startRect.left + startRect.width / 2,
                startY: startRect.top + startRect.height / 2,
                endX: endRect.left + endRect.width / 2,
                endY: endRect.top + endRect.height / 2,
            });
            calculatedRef.current = true;
        }
    }, [start, end]);

    if (!positions) return null;

    const { startX, startY, endX, endY } = positions;

    return (
        <motion.div
            initial={{
                left: startX,
                top: startY,
                scale: 0.6,
                opacity: 1,
            }}
            animate={{
                left: endX,
                top: endY,
                scale: [0.6, 1.1, 0.9],
            }}
            transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
            }}
            style={{
                position: 'fixed',
                width: 32,
                height: 32,
                borderRadius: '50%',
                // Lava lamp style - glossy red morphing to blue
                background: `
                    radial-gradient(circle at 30% 30%, #ff9999ee, transparent 50%),
                    radial-gradient(circle at 50% 50%, #ff6b6b, #e04545)
                `,
                boxShadow: `
                    0 0 30px rgba(255, 107, 107, 0.8),
                    0 0 60px rgba(255, 107, 107, 0.4),
                    inset 0 2px 8px rgba(255,255,255,0.4)
                `,
                pointerEvents: 'none',
                zIndex: 1000,
                transform: 'translate(-50%, -50%)',
                filter: 'url(#goo)', // Apply goo filter for lava lamp effect
            }}
        />
    );
}



