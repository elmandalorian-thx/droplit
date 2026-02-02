import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Projectile } from '../store/gameStore';

interface Projectile2DProps {
    projectile: Projectile;
}

export function Projectile2D({ projectile }: Projectile2DProps) {
    const { start, end } = projectile;
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert grid coords to pixel positions
    // This is approximate - in production we'd calculate based on actual cell positions
    const cellSize = 50; // approximate
    const gap = 12;
    const gridOffset = { x: 50, y: 50 }; // approximate offset from container edge

    const startX = gridOffset.x + start[0] * (cellSize + gap) + cellSize / 2;
    const startY = gridOffset.y + start[1] * (cellSize + gap) + cellSize / 2;
    const endX = gridOffset.x + end[0] * (cellSize + gap) + cellSize / 2;
    const endY = gridOffset.y + end[1] * (cellSize + gap) + cellSize / 2;

    return (
        <motion.div
            ref={containerRef}
            initial={{
                x: startX,
                y: startY,
                scale: 1,
                opacity: 1
            }}
            animate={{
                x: endX,
                y: endY,
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1], // Smooth easing
            }}
            style={{
                position: 'absolute',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #4facfe, #4facfe88)',
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.6)',
                pointerEvents: 'none',
                zIndex: 100,
            }}
        />
    );
}
