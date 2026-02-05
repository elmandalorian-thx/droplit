import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/SoundManager';

interface Cell2DProps {
    row: number;
    col: number;
}

const COLORS: Record<number, { main: string; light: string; dark: string }> = {
    0: { main: 'transparent', light: 'transparent', dark: 'transparent' },
    1: { main: '#6ec6d8', light: '#a3e0ec', dark: '#4a9fb3' },
    2: { main: '#d4a574', light: '#e8c9a6', dark: '#b8875a' },
    3: { main: '#c97b8b', light: '#dfa3b0', dark: '#a85e6e' },
};

export function Cell2D({ row, col }: Cell2DProps) {
    const value = useGameStore(state => state.grid[row]?.[col] ?? 0);
    const addDrop = useGameStore(state => state.addDrop);
    const isProcessing = useGameStore(state => state.isProcessing);
    const activePowerup = useGameStore(state => state.activePowerup);
    const useRainPowerup = useGameStore(state => state.useRainPowerup);
    const useBombPowerup = useGameStore(state => state.useBombPowerup);
    const useLaserPowerup = useGameStore(state => state.useLaserPowerup);

    const handleTap = useCallback(() => {
        if (isProcessing) return;

        soundManager.playDrip();

        if (activePowerup === 'rain') {
            useRainPowerup(row, col);
        } else if (activePowerup === 'bomb') {
            useBombPowerup(row, col);
        } else if (activePowerup === 'laser') {
            // Alternate: top half of grid clears column, bottom half clears row
            const direction = row >= 4 ? 'row' : 'col';
            useLaserPowerup(row, col, direction);
        } else {
            addDrop(row, col);
        }
    }, [addDrop, row, col, isProcessing, activePowerup, useRainPowerup, useBombPowerup, useLaserPowerup]);

    const size = useMemo(() => {
        if (value === 0) return 0;
        return 30 + value * 7;
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
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
                userSelect: 'none',
            }}
            onClick={handleTap}
        >
            <AnimatePresence mode="popLayout">
                {value > 0 && (
                    <motion.div
                        key={`drop-${row}-${col}-${value}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 35% 30%, ${palette.light}, ${palette.main} 55%, ${palette.dark})`,
                            boxShadow: `0 2px 12px ${palette.dark}33, inset 0 1px 4px rgba(255,255,255,0.2)`,
                            willChange: 'transform, opacity',
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 28,
                            opacity: { duration: 0.25 },
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
