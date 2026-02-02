import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Cell2DProps {
    row: number;
    col: number;
}

// Distinct color palette - clear progression from cool to hot
const COLORS: Record<number, { main: string; light: string; dark: string }> = {
    0: { main: 'transparent', light: 'transparent', dark: 'transparent' },
    1: { main: '#00d4aa', light: '#5effdb', dark: '#00a888' }, // Teal/Cyan
    2: { main: '#ffb347', light: '#ffd699', dark: '#e69520' }, // Orange/Amber
    3: { main: '#ff4757', light: '#ff7f8a', dark: '#d63040' }, // Red/Coral
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
            <AnimatePresence mode="popLayout">
                {value > 0 && (
                    <motion.div
                        key={`drop-${row}-${col}-${value}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        exit={{
                            scale: 0.3,
                            opacity: 0,
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onTapStart={() => setIsPressed(true)}
                        onTap={() => setIsPressed(false)}
                        onTapCancel={() => setIsPressed(false)}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            position: 'relative',
                            background: `radial-gradient(circle at 30% 30%, ${palette.light}, ${palette.main} 60%, ${palette.dark})`,
                            // Simplified shadow for GPU performance
                            boxShadow: `0 4px 16px ${palette.dark}66, inset 0 2px 4px rgba(255,255,255,0.3)`,
                            willChange: 'transform, opacity',
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25,
                            opacity: { duration: 0.2 },
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}


