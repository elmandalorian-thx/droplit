import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Cell2DProps {
    row: number;
    col: number;
}

// Premium color palette with gradients
const COLORS: Record<number, { main: string; light: string; dark: string }> = {
    0: { main: 'transparent', light: 'transparent', dark: 'transparent' },
    1: { main: '#4facfe', light: '#81c9ff', dark: '#2d8fd9' }, // Blue
    2: { main: '#a18cd1', light: '#c9b8e8', dark: '#7a5fb0' }, // Purple  
    3: { main: '#ff6b6b', light: '#ff9999', dark: '#e04545' }, // Red
};

export function Cell2D({ row, col }: Cell2DProps) {
    const value = useGameStore(state => state.grid[row]?.[col] ?? 0);
    const addDrop = useGameStore(state => state.addDrop);
    const isProcessing = useGameStore(state => state.isProcessing);
    const activePowerup = useGameStore(state => state.activePowerup);
    const useRainPowerup = useGameStore(state => state.useRainPowerup);
    const [_, setIsPressed] = useState(false);

    const handleTap = useCallback(() => {
        if (isProcessing) return;

        // If rain powerup is active, use it instead of normal drop
        if (activePowerup === 'rain') {
            useRainPowerup(row, col);
        } else {
            addDrop(row, col);
        }
    }, [addDrop, row, col, isProcessing, activePowerup, useRainPowerup]);

    const size = useMemo(() => {
        if (value === 0) return 0;
        return 32 + value * 6; // 38, 44, 50 px
    }, [value]);

    const palette = COLORS[value] || COLORS[0];

    // Randomize wobble for organic feel
    const wobbleDuration = useMemo(() => 2.2 + Math.random() * 0.6, []);
    const wobbleDelay = useMemo(() => Math.random() * 0.8, []);

    return (
        <div
            className="cell-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: '1',
                cursor: 'pointer',
                minWidth: 50,
                minHeight: 50,
            }}
            onClick={handleTap}
        >
            <AnimatePresence mode="wait">
                {value > 0 && (
                    <motion.div
                        key={`drop-${row}-${col}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: [0, -2, 0, 2, 0],
                            scaleX: [1, 1.02, 1, 0.98, 1],
                            scaleY: [1, 0.98, 1, 1.02, 1],
                        }}
                        exit={{ scale: 1.5, opacity: 0 }} // Burst outward on exit
                        whileHover={{ scale: 1.12, y: -2 }}
                        whileTap={{ scale: 0.88 }}
                        onTapStart={() => setIsPressed(true)}
                        onTap={() => setIsPressed(false)}
                        onTapCancel={() => setIsPressed(false)}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            position: 'relative',
                            // Premium 3D gradient - lighter from top-left
                            background: `
                                radial-gradient(circle at 25% 25%, ${palette.light}ee, transparent 50%),
                                radial-gradient(circle at 50% 50%, ${palette.main}, ${palette.dark})
                            `,
                            // Multi-layer shadow for depth
                            boxShadow: `
                                0 8px 25px ${palette.dark}55,
                                0 4px 12px ${palette.main}44,
                                inset 0 -4px 12px ${palette.dark}55,
                                inset 0 4px 8px rgba(255,255,255,0.35)
                            `,
                            // Subtle border for glass effect
                            border: `1px solid ${palette.light}44`,
                        }}
                        transition={{
                            scale: { type: 'spring', stiffness: 400, damping: 18 },
                            opacity: { duration: 0.25 },
                            y: { duration: wobbleDuration, repeat: Infinity, ease: 'easeInOut', delay: wobbleDelay },
                            scaleX: { duration: wobbleDuration, repeat: Infinity, ease: 'easeInOut', delay: wobbleDelay },
                            scaleY: { duration: wobbleDuration, repeat: Infinity, ease: 'easeInOut', delay: wobbleDelay },
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

