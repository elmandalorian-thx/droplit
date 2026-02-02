import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Projectile } from '../store/gameStore';

interface Projectile2DProps {
    projectile: Projectile;
}

export function Projectile2D({ projectile }: Projectile2DProps) {
    const { start, end } = projectile;
    const [gridRect, setGridRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // Find the grid wrapper to get its actual position
        const gridWrapper = document.querySelector('.grid-wrapper');
        if (gridWrapper) {
            setGridRect(gridWrapper.getBoundingClientRect());
        }
    }, []);

    if (!gridRect) return null;

    // Cell dimensions from CSS
    const cellSize = 50;
    const gap = 12;

    // Calculate positions within the grid
    // start[0] = col, start[1] = row
    const startX = gridRect.left + start[0] * (cellSize + gap) + cellSize / 2 + 16;
    const startY = gridRect.top + start[1] * (cellSize + gap) + cellSize / 2 + 16;
    const endX = gridRect.left + end[0] * (cellSize + gap) + cellSize / 2 + 16;
    const endY = gridRect.top + end[1] * (cellSize + gap) + cellSize / 2 + 16;

    return (
        <motion.div
            initial={{
                left: startX,
                top: startY,
                scale: 0.8,
                opacity: 1,
                background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #ee5a5a)',
                boxShadow: '0 0 25px rgba(255, 107, 107, 0.9), 0 0 50px rgba(255, 107, 107, 0.5)',
            }}
            animate={{
                left: endX,
                top: endY,
                scale: [0.8, 1.2, 1],
                background: 'radial-gradient(circle at 30% 30%, #4facfe, #00c6fb)',
                boxShadow: '0 0 25px rgba(79, 172, 254, 0.9), 0 0 50px rgba(79, 172, 254, 0.5)',
            }}
            transition={{
                duration: 0.8, // Slower for visibility
                ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
                position: 'fixed',
                width: 36,
                height: 36,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 1000,
                transform: 'translate(-50%, -50%)',
            }}
        />
    );
}


