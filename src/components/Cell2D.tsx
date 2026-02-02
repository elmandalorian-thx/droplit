import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Cell2DProps {
    row: number;
    col: number;
}

const COLORS: Record<number, string> = {
    0: 'transparent',
    1: '#4facfe', // Blue
    2: '#a18cd1', // Purple
    3: '#ff6b6b', // Red (softer)
};

export function Cell2D({ row, col }: Cell2DProps) {
    const value = useGameStore(state => state.grid[row]?.[col] ?? 0);
    const addDrop = useGameStore(state => state.addDrop);
    const isProcessing = useGameStore(state => state.isProcessing);
    const [_, setIsPressed] = useState(false);

    const handleTap = useCallback(() => {
        if (isProcessing) return;
        addDrop(row, col);
    }, [addDrop, row, col, isProcessing]);

    const size = useMemo(() => {
        if (value === 0) return 0;
        return 30 + value * 8; // 38, 46, 54 px
    }, [value]);

    const color = COLORS[value] || COLORS[0];

    // Randomize wobble for each drop
    const wobbleDuration = useMemo(() => 1.8 + Math.random() * 0.8, []);
    const wobbleDelay = useMemo(() => Math.random() * 0.5, []);

    return (
        <div
            className="cell-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: '1',
                cursor: 'pointer',
                minWidth: 40,
                minHeight: 40,
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
                            y: [0, -3, 0, 3, 0],
                            scaleX: [1, 1.03, 1, 0.97, 1],
                            scaleY: [1, 0.97, 1, 1.03, 1],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onTapStart={() => setIsPressed(true)}
                        onTap={() => setIsPressed(false)}
                        onTapCancel={() => setIsPressed(false)}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
                            boxShadow: `0 4px 20px ${color}66, inset 0 -2px 10px rgba(0,0,0,0.2), inset 0 2px 10px rgba(255,255,255,0.3)`,
                        }}
                        transition={{
                            scale: { type: 'spring', stiffness: 500, damping: 20 },
                            opacity: { duration: 0.2 },
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
