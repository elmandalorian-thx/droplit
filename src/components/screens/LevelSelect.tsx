import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './LevelSelect.css';

interface LevelSelectProps {
    highestLevel: number;
    currentLevel: number;
    onSelectLevel: (level: number) => void;
    onBack: () => void;
}

export function LevelSelect({ highestLevel, currentLevel, onSelectLevel, onBack }: LevelSelectProps) {
    const totalLevels = useMemo(() => {
        return Math.min(50, Math.max(20, highestLevel + 5));
    }, [highestLevel]);

    const levels = useMemo(() => {
        return Array.from({ length: totalLevels }, (_, i) => i + 1);
    }, [totalLevels]);

    return (
        <div className="level-select-screen">
            <div className="level-select-bg" />

            <motion.div
                className="level-select-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className="level-select-title">Select Level</h1>

                {highestLevel > 0 && (
                    <motion.button
                        className="continue-level-btn"
                        onClick={() => onSelectLevel(currentLevel)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Continue — Level {currentLevel}
                    </motion.button>
                )}

                <div className="level-grid">
                    {levels.map((level, index) => {
                        const isUnlocked = level <= Math.max(1, highestLevel + 1);
                        const isCompleted = level <= highestLevel;
                        const isCurrent = level === currentLevel;

                        return (
                            <motion.button
                                key={level}
                                className={`level-cell ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                onClick={() => isUnlocked && onSelectLevel(level)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.012, duration: 0.25 }}
                                whileHover={isUnlocked ? { scale: 1.12 } : {}}
                                whileTap={isUnlocked ? { scale: 0.9 } : {}}
                                disabled={!isUnlocked}
                            >
                                {isUnlocked ? level : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                <motion.button
                    className="level-select-back"
                    onClick={onBack}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Back
                </motion.button>
            </motion.div>
        </div>
    );
}
